// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

error EmptyList();
error ExistingList();

contract SllAsContracts {
  SllNode private head;

  event AddSllNode(SllNode ptr, bytes32 data, bool isHead);

  function isContract(address contractAddress) internal view returns (bool) {
    uint256 size;
    assembly {
      size := extcodesize(contractAddress)
    }
    return size > 0;
  }

  function createLinks(uint256 count) external {
    if (count == 0) {
      return;
    }
    if (!isContract(address(head))) {
      head = new SllNode("0");
      emit AddSllNode(head, "0", true);
    }
    if (count == 1) {
      return;
    }
    if (isContract(address(head.getNext()))) {
      revert ExistingList();
    }
    SllNode current = head;
    for (uint256 index = 1; index < count; index++) {
      bytes32 data = bytes32(abi.encodePacked(index));
      SllNode newSllNode = new SllNode(data);
      emit AddSllNode(newSllNode, data, false);
      current.setNext(newSllNode);
      current = newSllNode;
    }
  }

  function getLength() public view returns (uint256) {
    if (!isContract(address(head))) {
      return 0;
    }
    uint256 counter = 0;
    for (
      SllNode current = head;
      isContract(address(current));
      current = current.getNext()
    ) {
      counter++;
    }
    return counter;
  }

  function getHead() public view returns (SllNode) {
    return head;
  }

  function getTail() public view returns (SllNode) {
    if (!isContract(address(head))) {
      revert EmptyList();
    }
    SllNode tail = head;
    for (
      SllNode current = tail;
      isContract(address(current));
      current = current.getNext()
    ) {
      tail = current;
    }
    return tail;
  }
}

/// @title Single Linked List node
/// @author Utku Sarioglu
/// @notice Acts as a node of a singly linked list
/// @dev This would be an expensive approach to building a linked list
contract SllNode {
  bytes32 private data = bytes32(0);
  SllNode private next;

  constructor(bytes32 initialData) {
    data = initialData;
  }

  function setNext(SllNode nextSllNode) public {
    next = nextSllNode;
  }

  function setData(bytes32 newData) public {
    data = newData;
  }

  function getData() public view returns (bytes32) {
    return data;
  }

  function getNext() public view returns (SllNode) {
    return next;
  }
}
