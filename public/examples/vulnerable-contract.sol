pragma solidity ^0.8.19;

/**
 * @title VulnerableContract
 * @dev Contract demonstrativ cu multiple vulnerabilități pentru testarea SafeSolidity Lite
 */
contract VulnerableContract {
    mapping(address => uint256) public balances;
    address public owner;
    uint256 public deadline;
    
    constructor() {
        // TX.ORIGIN VULNERABILITY - nu folosiți tx.origin pentru authorization
        owner = tx.origin; // Should use msg.sender
        deadline = block.timestamp + 30 days;
    }
    
    function donate() external payable {
        balances[msg.sender] += msg.value;
    }
    
    /**
     * @dev REENTRANCY VULNERABILITY - state change după external call
     */
    function withdraw() external {
        require(balances[msg.sender] > 0, "No balance");
        
        // REENTRANCY: external call înainte de state change
        (bool success,) = msg.sender.call{value: balances[msg.sender]}("");
        require(success, "Transfer failed");
        
        // State change după external call - VULNERABLE!
        balances[msg.sender] = 0;
    }
    
    /**
     * @dev TX.ORIGIN VULNERABILITY pentru authorization
     */
    function checkAuth() external view returns (bool) {
        // TX.ORIGIN: folosirea tx.origin pentru auth este periculoasă
        return tx.origin == owner; // Should use msg.sender
    }
    
    /**
     * @dev TIMESTAMP DEPENDENCE VULNERABILITY
     */
    function isExpired() external view returns (bool) {
        // TIMESTAMP: dependența de block.timestamp poate fi manipulată
        return block.timestamp > deadline;
    }
    
    /**
     * @dev UNCHECKED EXTERNAL CALL VULNERABILITY
     */
    function unsafeTransfer(address payable to, uint256 amount) external {
        require(msg.sender == owner, "Not owner");
        require(address(this).balance >= amount, "Insufficient balance");
        
        // UNCHECKED CALL: rezultatul call() nu este verificat
        to.call{value: amount}(""); // Return value ignored!
    }
    
    /**
     * @dev Multiple vulnerabilities în aceeași funcție
     */
    function dangerousFunction(address payable recipient) external {
        // TX.ORIGIN pentru auth
        require(tx.origin == owner, "Not authorized");
        
        // TIMESTAMP pentru logic
        require(block.timestamp < deadline, "Expired");
        
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        // UNCHECKED CALL + potential REENTRANCY
        recipient.call{value: amount}("");
        balances[msg.sender] = 0;
    }
    
    // Helper function pentru replenish în testing
    function emergencyWithdraw() external {
        require(tx.origin == owner, "Not owner"); // TX.ORIGIN vulnerability
        payable(owner).transfer(address(this).balance);
    }
}
