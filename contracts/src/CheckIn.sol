// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Daily check-in for Base (gas-only, no ETH tips).
/// @dev Encoded day index = calendar day + 1 so 0 remains a sentinel for "never checked".
contract CheckIn {
    uint256 public constant SECONDS_PER_DAY = 86400;

    /// @notice 0 = never checked in; otherwise `calendarDayIndex + 1`.
    mapping(address => uint256) internal lastCheckInDayEncoded;

    mapping(address => uint256) public streak;

    event CheckedIn(address indexed user, uint256 dayIndex, uint256 streak);

    error NoEthAccepted();
    error AlreadyCheckedInToday();

    function lastCheckInDayIndex(address user) external view returns (uint256 dayIndex) {
        uint256 enc = lastCheckInDayEncoded[user];
        return enc == 0 ? 0 : enc - 1;
    }

    function checkIn() external payable {
        if (msg.value != 0) revert NoEthAccepted();

        uint256 dayIndex = block.timestamp / SECONDS_PER_DAY;
        uint256 enc = lastCheckInDayEncoded[msg.sender];

        if (enc != 0) {
            uint256 prevDay = enc - 1;
            if (prevDay == dayIndex) revert AlreadyCheckedInToday();
        }

        uint256 lastDay = enc == 0 ? type(uint256).max : enc - 1;

        uint256 newStreak;
        if (enc == 0) {
            newStreak = 1;
        } else if (dayIndex == lastDay + 1) {
            newStreak = streak[msg.sender] + 1;
        } else {
            newStreak = 1;
        }

        lastCheckInDayEncoded[msg.sender] = dayIndex + 1;
        streak[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, dayIndex, newStreak);
    }
}
