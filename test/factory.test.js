const { expect } = require("chai");

const creator = "0x8873b045d40A458e46E356a96279aE1820a898bA";
const name = "500GreatestSongs";
const symbol = "GSAT";

describe("Factory", () => {
  describe("# constructor", () => {
    before(async () => {
      // set test data
      this.name = "500GreatestSongs";
      this.symbol = "GSAT";
      this.one = ethers.BigNumber.from("1");
      [this.owner, this.proxy, this.recipient, this.other] = await ethers.getSigners();
      // deploy token
      const Token = await ethers.getContractFactory("GSAT");
      this.token = await Token.deploy();
      await this.token.deployed();
      this.cap = await this.token.cap();
      // deploy registry
      const Registry = await ethers.getContractFactory("ProxyRegistry");
      this.registry = await Registry.deploy(this.proxy.address);
      await this.registry.deployed();
      // deploy factory
      const Factory = await ethers.getContractFactory("GSATFactory");
      this.factory = await Factory.deploy(this.token.address, this.registry.address);
      await this.factory.deployed();
      // transfer token ownership
      this.tx = await this.token.transferOwnership(this.factory.address);
      await this.tx.wait();
    });

    it("it sets the owner", async () => {
      expect(await this.factory.owner()).to.equal(this.owner.address);
    });

    it("it sets the token address", async () => {
      expect(await this.factory.token()).to.equal(this.token.address);
    });

    it("it sets the registry address", async () => {
      expect(await this.factory.registry()).to.equal(this.registry.address);
    });
  });

  describe("# name", () => {
    it("it returns the original token name", async () => {
      expect(await this.factory.name()).to.equal(this.name);
    });
  });

  describe("# symbol", () => {
    it("it returns the original token symbol", async () => {
      expect(await this.factory.symbol()).to.equal(this.symbol);
    });
  });

  describe("# numOptions", () => {
    it("it returns the original token cap", async () => {
      expect(await this.factory.numOptions()).to.equal(this.cap);
    });
  });

  describe("# supportsFactoryInterface", () => {
    it("it returns true", async () => {
      expect(await this.factory.supportsFactoryInterface()).to.equal(true);
    });
  });

  describe("# canMint", () => {
    describe("» option / token id is within the cap range", () => {
      describe("» and token has not been minted yet", () => {
        it("it returns true", async () => {
          expect(await this.factory.canMint(0)).to.equal(true);
          expect(await this.factory.canMint(this.cap.sub(this.one))).to.equal(true);
        });
      });

      describe("» but token has already been minted", () => {
        before(async () => {
          this.tx = await this.factory.connect(this.owner).mint(0, this.recipient.address);
          this.receipt = this.tx.wait();
        });

        it("it returns false", async () => {
          expect(await this.factory.canMint(0)).to.equal(false);
        });
      });
    });

    describe("» option / token id is out of the cap range", () => {
      it("it returns false", async () => {
        expect(await this.factory.canMint(this.cap.add(this.one))).to.equal(false);
      });
    });
  });

  describe("# tokenURI", () => {
    describe("» option / token id is within the cap range", () => {
      it("it returns the right URI", async () => {
        const baseURI = await this.token.baseURI();
        expect(await this.factory.tokenURI(0)).to.equal(baseURI + "0");
      });
    });

    describe("» option / token id is out of the cap range", () => {
      it("it reverts", async () => {
        await expect(this.factory.tokenURI(this.cap.add(this.one))).to.be.revertedWith("GSATFactory: URI query for nonexistent token");
      });
    });
  });

  describe("# mint", () => {
    describe("» option / token id is within the cap range", () => {
      describe("» and token has not been minted yet", () => {
        describe("» and caller is owner's proxy", () => {
          before(async () => {
            this.tx = await this.factory.connect(this.proxy).mint(1, this.recipient.address);
            this.receipt = this.tx.wait();
          });

          it("it mints token", async () => {
            expect(await this.token.ownerOf(1)).to.equal(this.recipient.address);
          });
        });

        describe("» and caller is owner", () => {
          before(async () => {
            this.tx = await this.factory.connect(this.owner).mint(2, this.recipient.address);
            this.receipt = this.tx.wait();
          });

          it("it mints token", async () => {
            expect(await this.token.ownerOf(2)).to.equal(this.recipient.address);
          });
        });

        describe("» but caller is neither owner's proxy nor owner", () => {
          it("it reverts", async () => {
            await expect(this.factory.connect(this.other).mint(3, this.recipient.address)).to.be.revertedWith(
              "GSATFactory: must be owner's proxy or owner to mint"
            );
          });
        });
      });

      describe("» but token has already been minted", () => {
        it("it reverts", async () => {
          await expect(this.factory.connect(this.owner).mint(0, this.recipient.address)).to.be.revertedWith("GSATFactory: unavailable token");
        });
      });
    });

    describe("» but option / token id is out of the cap range", () => {
      it("it reverts", async () => {
        await expect(this.factory.connect(this.owner).mint(500, this.recipient.address)).to.be.revertedWith("GSATFactory: unavailable token");
      });
    });
  });
});
