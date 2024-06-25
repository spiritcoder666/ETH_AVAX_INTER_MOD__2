// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Author : Rohit

contract GameToken {
    address payable public owner;
    uint256 public balance;
    string public tokenName = "Rohit Mehta";
    string public tokenAbbrv = "RM";
    uint256 public totalSupply;

    modifier onlyTokenOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function getTokenName() public view returns(string memory) {
        return tokenName;
    }

    function getTokenAbbrv() public view returns(string memory) {
        return tokenAbbrv;
    }

    function getTotalSupply() public view returns(uint256) {
        return totalSupply;
    }

    function recharge(address _address, uint256 _amount) public onlyTokenOwner {
        uint256 previousBalance = balance;
        balances[_address] += _amount;
        totalSupply += _amount;
        balance += _amount;
        assert(balance == previousBalance + _amount);
    }

    function redeemItem(address _address, uint256 _amount /*, string memory _item */) public {
        require(_amount <= balances[_address], "Insufficient balance to redeem item");
        uint256 previousBalance = balance;
        balances[_address] -= _amount;
        totalSupply -= _amount;
        balance -= _amount;
        assert(balance == previousBalance - _amount);
    }

    function changeOwner(address _newOwner) public onlyTokenOwner {
        if (msg.sender != owner) {
            revert("Requires owner to personally change to new owner");
        }
        owner = payable(_newOwner);
    }

    mapping(address => uint256) public balances;
}
