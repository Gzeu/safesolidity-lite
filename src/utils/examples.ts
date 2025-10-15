export const vulnerableExample = `pragma solidity ^0.8.0;

contract Vault {
    mapping(address => uint) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        // Reentrancy risk: external call before state update
        (bool ok, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(ok, "call failed");
        balances[msg.sender] = 0;
    }

    function ownerOnly() external {
        require(tx.origin == msg.sender, "not owner"); // tx.origin misuse
    }

    function lottery() external view returns (bool) {
        return (block.timestamp % 2 == 0); // timestamp dependence
    }
}
`;
