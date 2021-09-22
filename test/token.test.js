const { expect } = require("chai");
const { holders, friends } = require("./lib");
const DropCount = 50 + 5 + 50 + 33;

const Batch = {
  Arkhe: 0,
  Drop: 1,
  A: 2,
  B: 3,
};

describe.only("Token", () => {
  before(async () => {
    // set test data
    this.name = "500GreatestSongs";
    this.symbol = "GSAT";
    [this.owner, this.proxy, this.recipient, this.operator, this.other] = await ethers.getSigners();
    // deploy registry
    const Registry = await ethers.getContractFactory("ProxyRegistry");
    this.registry = await Registry.deploy(this.proxy.address);
    await this.registry.deployed();
    // deploy token
    const Token = await ethers.getContractFactory("GSAT");
    this.token = await Token.deploy(this.registry.address);
    await this.token.deployed();

    this.david = await this.token.david();
    this.olivier = await this.token.olivier();
    this.alex = await this.token.alex();
  });

  describe("# constructor", () => {
    it("it sets contract owner", async () => {
      expect(await this.token.owner()).to.equal(this.owner.address);
    });

    it("it sets contract name", async () => {
      expect(await this.token.name()).to.equal(this.name);
    });

    it("it sets contract symbol", async () => {
      expect(await this.token.symbol()).to.equal(this.symbol);
    });

    it("it pre-mints tokens [1 - 20] and [334 - 350] to David", async () => {
      for (let i = 1; i <= 20; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.david);
      }

      for (let i = 334; i <= 350; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.david);
      }
    });

    it("it pre-mints tokens [71 - 80], [101 - 110], [151 - 160] and [201 - 220] to Olivier", async () => {
      for (let i = 71; i <= 80; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 101; i <= 110; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 151; i <= 160; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }

      for (let i = 201; i <= 220; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.olivier);
      }
    });

    it("it pre-mints tokens [116 - 120] to Alex", async () => {
      for (let i = 116; i <= 120; i++) {
        expect(await this.token.ownerOf(i)).to.equal(this.alex);
      }
    });
  });

  describe("# mint", () => {
    describe("» caller is owner", () => {
      describe("» and tokens have not been minted yet", () => {
        describe("» Batch.Drop", () => {
          before(async () => {
            this.tx = await this.token.mint(Batch.Drop);
            this.receipt = await this.tx.wait();
          });

          it("it pre-mints tokens [21 - 70] to holders", async () => {
            for (let i = 0; i < 50; i++) {
              expect((await this.token.ownerOf(i + 21)).toLowerCase()).to.equal(holders[i].toLowerCase());
            }
          });

          it("it pre-mints tokens [301 - 333] to friends", async () => {
            for (let i = 0; i < 33; i++) {
              expect((await this.token.ownerOf(i + 301)).toLowerCase()).to.equal(friends[i].toLowerCase());
            }
          });
        });

        describe("» Batch.A and Batch.B", () => {
          before(async () => {
            this.tx = await this.token.mint(Batch.A);
            this.receipt = await this.tx.wait();

            this.tx = await this.token.mint(Batch.B);
            this.receipt = await this.tx.wait();
          });

          it("it mints the remaining tokens", async () => {
            expect(await this.token.totalSupply()).to.equal(500);
            expect(await this.token.balanceOf(this.david)).to.equal(500 - DropCount);
          });
        });
      });

      describe("» but tokens have already been minted", () => {
        it("it reverts", async () => {
          await expect(this.token.mint(Batch.Drop)).to.be.revertedWith("ERC721: token already minted");
        });
      });
    });

    describe("» caller is not owner", () => {
      it("it reverts", async () => {
        await expect(this.token.connect(this.other).mint(Batch.Drop)).to.be.revertedWith("GSAT: must be owner to mint");
      });
    });
  });

  describe("# isApprovedForAll", () => {
    describe("» operator is user's proxy", () => {
      it("it returns true", async () => {
        expect(await this.token.isApprovedForAll(this.owner.address, this.proxy.address)).to.equal(true);
      });
    });

    describe("» operator is approved by user", () => {
      before(async () => {
        this.tx = await this.token.setApprovalForAll(this.operator.address, true);
        this.receipt = await this.tx.wait();
      });

      it("it returns true", async () => {
        expect(await this.token.isApprovedForAll(this.owner.address, this.operator.address)).to.equal(true);
      });
    });

    describe("» operator is neither user's proxy nor approved by user", () => {
      it("it returns false", async () => {
        expect(await this.token.isApprovedForAll(this.owner.address, this.other.address)).to.equal(false);
      });
    });
  });
});
