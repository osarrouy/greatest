// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GSAT is Context, Ownable, ERC721("500GreatestSongs", "GSAT") {
    using Strings for uint256;

    uint256 public constant cap = 500;
    address public constant david = 0xcB46AAe3e534E98FEc550aE511bdeE78B9098687;
    address public constant olivier = 0x8873b045d40A458e46E356a96279aE1820a898bA;
    address public constant alex = 0x04A2437c0D2d1C5BA25D68D62b32E4318F96C448;

    constructor() {
        _preMint();
    }

    function mint(address to, uint256 tokenId) external {
        require(_msgSender() == owner(), "GSAT: must be owner to mint");

        _safeMint(to, tokenId);
    }

    function canMint(uint256 tokenId) public view returns (bool) {
        if (tokenId >= cap) return false;
        if (_exists(tokenId)) return false;

        return true;
    }

    function baseTokenURI() public pure returns (string memory) {
        return baseURI();
    }

    function baseURI() public pure returns (string memory) {
        return _baseURI();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUq5anWNehvnDoeLuJjLebhwjko1TcSjwLsF75eCtWoPh/";
    }

    function _preMint() private {
        uint256 tokenId;

        for (tokenId = 0; tokenId < 70; tokenId++) {
            _mint(david, tokenId);
        }

        for (tokenId = 300; tokenId < 320; tokenId++) {
            _mint(david, tokenId);
        }

        for (tokenId = 70; tokenId < 80; tokenId++) {
            _mint(olivier, tokenId);
        }

        for (tokenId = 100; tokenId < 110; tokenId++) {
            _mint(olivier, tokenId);
        }        

        for (tokenId = 150; tokenId < 160; tokenId++) {
            _mint(olivier, tokenId);
        }

        for (tokenId = 200; tokenId < 220; tokenId++) {
            _mint(olivier, tokenId);
        }

        for (tokenId = 115; tokenId < 120; tokenId++) {
            _mint(alex, tokenId);
        }
    }
}
