pragma solidity ^0.8.19;

/**
 * @title SecureContract
 * @dev Contract securizat care demonstrează fix-urile pentru vulnerabilitățile din VulnerableContract
 */
contract SecureContract {
    mapping(address => uint256) public balances;
    address public owner;
    uint256 public deadline;
    
    // Reentrancy protection
    bool private locked;
    
    // Events pentru transparency
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event Transfer(address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        // FIX: folosește msg.sender în loc de tx.origin
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier noReentrant() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }
    
    modifier notExpired() {
        // FIX: folosește un buffer pentru timestamp manipulation
        require(block.timestamp <= deadline + 1 hours, "Contract expired");
        _;
    }
    
    constructor() {
        // FIX: folosește msg.sender în loc de tx.origin
        owner = msg.sender;
        deadline = block.timestamp + 30 days;
    }
    
    function donate() external payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev SECURE WITHDRAWAL cu protecție împotriva reentrancy
     */
    function withdraw() external noReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        // FIX: state change ÎNAINTE de external call (Checks-Effects-Interactions)
        balances[msg.sender] = 0;
        
        // External call după state change
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev SECURE AUTHORIZATION cu msg.sender
     */
    function checkAuth() external view returns (bool) {
        // FIX: folosește msg.sender în loc de tx.origin
        return msg.sender == owner;
    }
    
    /**
     * @dev SECURE TIMESTAMP CHECK cu buffer pentru manipulare
     */
    function isExpired() external view returns (bool) {
        // FIX: adaugă buffer pentru timestamp manipulation (1 oră)
        return block.timestamp > (deadline + 1 hours);
    }
    
    /**
     * @dev SECURE EXTERNAL CALL cu verificarea rezultatului
     */
    function safeTransfer(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(address(this).balance >= amount, "Insufficient contract balance");
        require(amount > 0, "Amount must be positive");
        
        // FIX: verifică rezultatul call()
        (bool success,) = to.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Transfer(to, amount);
    }
    
    /**
     * @dev SECURE FUNCTION cu toate protecțiile aplicate
     */
    function secureFunction(address payable recipient) external onlyOwner notExpired noReentrant {
        require(recipient != address(0), "Invalid recipient");
        
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance available");
        
        // Checks-Effects-Interactions pattern
        balances[msg.sender] = 0;
        
        // Verifică rezultatul external call
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Transfer to recipient failed");
        
        emit Withdrawal(msg.sender, amount);
        emit Transfer(recipient, amount);
    }
    
    /**
     * @dev EMERGENCY WITHDRAWAL cu protecții complete
     */
    function emergencyWithdraw() external onlyOwner noReentrant {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to withdraw");
        
        (bool success,) = payable(owner).call{value: contractBalance}("");
        require(success, "Emergency withdrawal failed");
        
        emit Transfer(owner, contractBalance);
    }
    
    /**
     * @dev Update deadline cu protecții
     */
    function updateDeadline(uint256 newDeadline) external onlyOwner {
        require(newDeadline > block.timestamp, "Deadline must be in future");
        require(newDeadline <= block.timestamp + 365 days, "Deadline too far in future");
        
        deadline = newDeadline;
    }
    
    /**
     * @dev View function pentru balans contract
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev View function pentru user balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
