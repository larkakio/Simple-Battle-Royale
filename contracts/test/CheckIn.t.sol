// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn internal c;
    address internal alice = address(0xA11CE);

    uint256 internal constant DAY = 86400;

    function setUp() public {
        c = new CheckIn();
    }

    function test_checkIn_first_time() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.stopPrank();

        assertEq(c.lastCheckInDayIndex(alice), block.timestamp / DAY);
        assertEq(c.streak(alice), 1);
    }

    function test_revert_on_second_check_same_day() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_revert_on_eth_sent() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(CheckIn.NoEthAccepted.selector);
        c.checkIn{value: 1 wei}();
    }

    function test_streak_increments_next_day() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + DAY);
        c.checkIn();
        vm.stopPrank();
        assertEq(c.streak(alice), 2);
    }

    function test_streak_resets_after_gap() public {
        vm.startPrank(alice);
        c.checkIn();
        vm.warp(block.timestamp + 3 * DAY);
        c.checkIn();
        vm.stopPrank();
        assertEq(c.streak(alice), 1);
    }
}
