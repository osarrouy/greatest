// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IProxyRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "hardhat/console.sol";
contract GSAT is Context, Ownable, ERC721Enumerable  {
    enum Batch {
        Arkhe,
        Drop,
        Sale
    }

    uint256 public constant cap = 500;
    address public constant david = 0xcB46AAe3e534E98FEc550aE511bdeE78B9098687;
    address public constant olivier = 0x8873b045d40A458e46E356a96279aE1820a898bA;
    address public constant alex = 0x04A2437c0D2d1C5BA25D68D62b32E4318F96C448; // check

    IProxyRegistry public registry;

    constructor(IProxyRegistry _registry) Ownable() ERC721("500GreatestSongs", "GSAT") {
        registry = _registry;
        _preMint(Batch.Arkhe);
    }

    function mint(Batch batch) external {
        require(_msgSender() == owner(), "GSAT: must be owner to mint");

        _preMint(batch);
    }

    function baseTokenURI() public pure returns (string memory) {
        return baseURI();
    }

    function baseURI() public pure returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVomqCgpD5bTxxeRufsZGj8Pn6MojqvLazDKJNKe3Knkq/";
    }

    function _preMint(Batch batch) private {
        uint256 iterator;

        if (batch == Batch.Arkhe) {
            for (iterator = 1; iterator <= 20; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 334; iterator <= 350; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 71; iterator <= 80; iterator++) {
                _mint(olivier, iterator);
            }

            for (iterator = 101; iterator <= 110; iterator++) {
                _mint(olivier, iterator);
            }

            for (iterator = 151; iterator <= 160; iterator++) {
                _mint(olivier, iterator);
            }

            for (iterator = 201; iterator <= 220; iterator++) {
                _mint(olivier, iterator);
            }

            for (iterator = 116; iterator <= 120; iterator++) {
                _mint(alex, iterator);
            }
        }

        if (batch == Batch.Drop) {
            address[50] memory holders = [
                0x1FfF3ca76b10156CaD152F60cE2791469e91Cc29,
                0x39183cd265F50Af7533eC058A4c807CA9bB6D10a,
                0x83064E29B99076692ee89A80bA88e906DF5eB3F5,
                0x2eB5e5713A874786af6Da95f6E4DEaCEdb5dC246,
                0xDc5b961a5aB04ac38321c89100584fB965721931,
                0xd20f3a541f9Ffa585b07440eDFB1cF0cD596E8B6,
                0x0d333279FbB29145d7d9c0B09Cb780a061d563cF,
                0x32084c6132b430a6B618680314285a64D23C7500,
                0x2eB5e5713A874786af6Da95f6E4DEaCEdb5dC246,
                0x5a2b6E84fadAa8B23cE782cb6226F87D1ba02416,
                0x41d74A710ef67625B8caF0B5512e6926B1e19C2c,
                0x41d74A710ef67625B8caF0B5512e6926B1e19C2c,
                0xc627534f95656fA358010D59f3FDDB7123BbcE91,
                0x7E99611Cf208CB097497a59b3FB7Cb4dFd115Ea9,
                0x9822C731b38009A05384fFd757c854f71CE751F9,
                0xd9d23DB5632262033ad9F73aC8FBBa8d76d00188,
                0x1be93794a0Db6a4d9C3B2aB1A4D125bfdeb6387E,
                0x37F146ABBDA35Fbe002a5881f01dE58af1171Ad3,
                0x0842Df371707f3C7235AdDD064C3DF86E6805884,
                0xD76ED14e9dbB0983489f4a1BBB45EC18AC78B7dF,
                0x465f7D0d4EB6E7dDDECce9203796892D481f2B0b,
                0xB65b6a912dAE74c165e7267e44AF701E54b6055e,
                0xe91F0085F5c3e67C8Ebd5c8f6E7f4d884452DBAa,
                0x45e2Aa1483A1C02f1E7D07FF904bb1dEd9350aB7,
                0xa36eEb3eCf6D39768aBc61fdF56759913a172344,
                0x45e2Aa1483A1C02f1E7D07FF904bb1dEd9350aB7,
                0xa3bEDEaBc56c226DF5ac4755e182308B08C166ed,
                0xC1E549320f048D8149d5B0cB9Cb268dA59f1F2aD,
                0xE644B8DEB627d630496CcB2675ba195049C98a27,
                0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B,
                0xCC1e1757A47b5e2D02AC39554E6ACdF8BcAF5bB5,
                0xF9D681C3b81AA1d0ecb3FDB4c69Ca57714Eb63F4,
                0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B,
                0x561D143d64C1548444A5B7390b846fcb736bD07B,
                0x765FA0Ea95Cc6954B546b844D17d757b5f523d09,
                0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B,
                0x5AEEdbc6b655C13950F32E5E8a0760D15Bbe0Afb,
                0x37F146ABBDA35Fbe002a5881f01dE58af1171Ad3,
                0x5ce5f2F7C6f78A15554a72E2789C2ED9c1AC00a0,
                0xF67A5ddF08149F0325Ac7EB4af3EfB7c6f690eF1,
                0x1CC51e5Ce9fD2f8ed687AfE3AdA52aaB833Fe908,
                0x765FA0Ea95Cc6954B546b844D17d757b5f523d09,
                0x5ce5f2F7C6f78A15554a72E2789C2ED9c1AC00a0,
                0xc52f437506069D5A678b3D11cc9919Efdb8C48FB,
                0x42F7c5275aC4372156027d939843C9C42523DF2E,
                0x91364516D3CAD16E1666261dbdbb39c881Dbe9eE,
                0x6301Add4fb128de9778B8651a2a9278B86761423,
                0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B,
                0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B,
                0xa3bEDEaBc56c226DF5ac4755e182308B08C166ed
            ];

            address[33] memory friends = [
                0xEa222daA28565874776D4fecFE4728812A05bd24,
                0x86E578946D012B73c4B62070AF5c8c9e62D5a22A,
                0xc9D483b27701A1299c09872b813BF9CB8251475A,
                0x547E56e9b748ba28d4dDd354DA89521F9F80EEB5,
                0x3eC8637bf2b2E5Bd1186fFc407001C810e325266,
                0x461123fB3a23b5503c01AFDb83B0E4387c98Ed4B,
                0x41f7B7f1C0805fFe647e2d533767d2Ecd1ef4875,
                0x6186290B28D511bFF971631c916244A9fC539cfE,
                0x586fbCD1662752ee46482fbc9959456a0D93D86f,
                0x3432B45B9ee95BD5C31a726B936CF2ec719A2153,
                0x13e49cD3F314188032bED445A2F3dE55f3669110,
                0xec8c1050B45789f9ee4D09dCC7D64aAF9e233338,
                0xBBc30DdDa94ac46496736215129B6b6f8c02bbF4,
                0x791FAD8329A0A56e2ce98380D6D6FdA3302337Da,
                0xcbf7564744fCEA375795D5BEe667CA3c7C2bDe5f,
                0x6bfd30747Ba72Ac7BB2f20D6138e1312020fAFe8,
                0xe703f231aB056eCb99C92a1232cC1020ACFC72f8,
                0xe703f231aB056eCb99C92a1232cC1020ACFC72f8,
                0xe703f231aB056eCb99C92a1232cC1020ACFC72f8,
                0x1be93794a0Db6a4d9C3B2aB1A4D125bfdeb6387E,
                0x1be93794a0Db6a4d9C3B2aB1A4D125bfdeb6387E,
                0x720A4FaB08CB746fC90E88d1924a98104C0822Cf,
                0x720A4FaB08CB746fC90E88d1924a98104C0822Cf,
                0xAB6cA2017548A170699890214bFd66583A0C1754,
                0xAB6cA2017548A170699890214bFd66583A0C1754,
                0x0EB47BEabd9CE2cab7CbED57aA6B040975BDc1b7,
                0xc8C90C83fd08d7E66703982DE7a6177732240ca0,
                0x31e99699bCCde902afc7C4B6b23bB322b8459d22,
                0x28a3022841cc4d307283e320D8EF8Dee7aD606e9,
                0x5649a48eaa84c6c85c833289a7860540dC11c023,
                0x0b8F4C4E7626A91460dac057eB43e0de59d5b44F,
                0x4AF4aEBe930e938FA11aD28cD2c88645cCe739A1,
                0xDc5b961a5aB04ac38321c89100584fB965721931
            ];
              console.log("Holders");
            
            for (iterator = 0; iterator < 50; iterator++) {
              console.log(iterator + 21);
                _mint(holders[iterator], iterator + 21);
            }

              console.log("Friends");


            for (iterator = 0; iterator < 33; iterator++) {
              console.log(iterator + 301);

                _mint(friends[iterator], iterator + 301);
            }
        }

        if (batch == Batch.Sale) {
            for (iterator = 91; iterator <= 100; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 111; iterator <= 115; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 121; iterator <= 150; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 161; iterator <= 200; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 221; iterator <= 300; iterator++) {
                _mint(david, iterator);
            }

            for (iterator = 334; iterator <= 500; iterator++) {
                _mint(david, iterator);
            }
        }
    }
}
