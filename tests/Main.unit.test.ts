import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Main } from "_typechain/Main";
import { ethers } from "hardhat";
import {
  localAccounts,
  beforeEachFacade,
  expect,
} from "_services/test.service";

const CONTRACT_NAME = "Main";

describe(CONTRACT_NAME, () => {
  localAccounts.forEach(({ index, name, address }) => {
    let instance: Main;
    let signer: SignerWithAddress;

    describe(`As ${name} at ${address} (${index})`, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Main>(CONTRACT_NAME, [], index);
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("constructor", () => {
        it("runs without reverting", async () => {
          expect(true).to.equal(true);
        });
      });
    });
  });
});
