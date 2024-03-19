// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PeoplesVoice {
    struct Bounty {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Bounty) public bounties;

    uint256 public numberOfBounties = 0;

    function createBounty(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Bounty storage bounty = bounties[numberOfBounties];

        require(bounty.deadline < block.timestamp, "The deadline should be a date in the future.");

        bounty.owner = _owner;
        bounty.title = _title;
        bounty.description = _description;
        bounty.target = _target;
        bounty.deadline = _deadline;
        bounty.amountCollected = 0;
        bounty.image = _image;

        numberOfBounties++;

        return numberOfBounties - 1;
    }

    function donateToBounty(uint256 _id) public payable {
        uint256 amount = msg.value;

        Bounty storage bounty = bounties[_id];

        bounty.donators.push(msg.sender);
        bounty.donations.push(amount);

        (bool sent,) = payable(bounty.owner).call{value: amount}("");

        if (sent) {
            bounty.amountCollected = bounty.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (bounties[_id].donators, bounties[_id].donations);
    }

    function getBounties() public view returns (Bounty[] memory) {
        Bounty[] memory allBounties = new Bounty[](numberOfBounties);

        for (uint256 i = 0; i < numberOfBounties; i++) {
            Bounty storage item = bounties[i];

            allBounties[i] = item;
        }

        return allBounties;
    }
}
