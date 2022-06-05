import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type SllAsContracts } from "_typechain/SllAsContracts";
import { type SllNode } from "_typechain/SllNode";
import { ethers } from "hardhat";
import {
  localAccounts,
  beforeEachFacade,
  expect,
} from "_services/test.service";

const CONTRACT_NAME = "SllAsContracts";
const SLL_NODE_ARTIFACT =
  "../lib/artifacts/src/contracts/SllAsContracts.sol/SllNode.json";

describe(CONTRACT_NAME, () => {
  localAccounts.slice(0, 1).forEach(({ index, name, address }) => {
    let instance: SllAsContracts;
    let signer: SignerWithAddress;

    describe(`As ${name} at ${address} (${index})`, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<SllAsContracts>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("getHead", () => {
        it("returns address", async () => {
          const head = await instance.getHead();
          expect(ethers.utils.isAddress(head)).to.be.true;
        });

        it("Refers to a node contract", async () => {
          const abi = require(SLL_NODE_ARTIFACT).abi;
          await instance.createLinks(1);
          const head = await instance.getHead();
          const one = new ethers.Contract(head, abi, signer) as SllNode;
          const data = await one.getData();
          const expected = ethers.utils.formatBytes32String("0");
          expect(data).to.equal(expected);
        });
      });

      describe("createLinks", () => {
        it("Handles 0", async () => {
          return expect(instance.createLinks(0)).to.not.emit(
            instance,
            "AddSllNode"
          );
        });

        it("Handles 1", async () => {
          return expect(instance.createLinks(1)).to.emit(
            instance,
            "AddSllNode"
          );
        });

        it("Handles head being created twice", async () => {
          await expect(instance.createLinks(1)).to.emit(instance, "AddSllNode");
          return expect(instance.createLinks(1)).to.not.emit(
            instance,
            "AddSllNode"
          );
        });

        it("Handles creation of 2", async () => {
          return expect(instance.createLinks(2))
            .to.emit(instance, "AddSllNode")
            .to.emit(instance, "AddSllNode")
            .to.emit(instance, "AddSllNode");
        });

        it("Reverts double creation", async () => {
          await instance.createLinks(2);
          return expect(instance.createLinks(2)).to.be.revertedWith(
            "ExistingList"
          );
        });
      });

      describe("getLength", () => {
        it("Returns 0 on empty list", async () => {
          const expected = ethers.BigNumber.from(0);
          expect(await instance.getLength()).to.equal(expected);
        });

        it("Returns 1 with only head", async () => {
          await instance.createLinks(1);
          const expected = ethers.BigNumber.from(1);
          expect(await instance.getLength()).to.equal(expected);
        });

        it("Returns 2 with head + one extra", async () => {
          const count = 2;
          await instance.createLinks(count);
          const expected = ethers.BigNumber.from(count);
          expect(await instance.getLength()).to.equal(expected);
        });

        it("Returns correct count for arbitrary values", async () => {
          const count = 10;
          await instance.createLinks(count);
          const expected = ethers.BigNumber.from(count);
          expect(await instance.getLength()).to.equal(expected);
        });
      });

      describe("getTail", () => {
        it("Reverts when there is no node", async () => {
          return expect(instance.getTail()).to.be.revertedWith("EmptyList");
        });

        it("Returns head when there is only one node", async () => {
          await instance.createLinks(1);
          const headAddress = await instance.getHead();
          expect(await instance.getTail()).to.be.equal(headAddress);
        });

        it("Returns 2nd when there are 2 nodes", async () => {
          await instance.createLinks(2);
          const headAddress = await instance.getHead();
          const abi = require(SLL_NODE_ARTIFACT).abi;
          const head = new ethers.Contract(headAddress, abi, signer) as SllNode;
          const secondAddress = await head.getNext();
          expect(await instance.getTail()).to.equal(secondAddress);
        });
      });
    });
  });
});
