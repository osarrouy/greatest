// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./GSAT.sol";
import "./interfaces/IFactoryERC721.sol";
import "./interfaces/IProxyRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GSATFactory is Context, Ownable, IFactoryERC721 {
    using Strings for uint256;

    uint256 private constant NB_OF_TOKENS = 3;


    GSAT public gsat;
    IProxyRegistry public registry;

    constructor(GSAT _gsat, IProxyRegistry _registry) {
        // we do not check addresses to save gas
        gsat = _gsat;
        registry = _registry;
    }

    function name() public view override returns (string memory) {
        return gsat.name();
    }

    function symbol() public view override returns (string memory) {
        return gsat.symbol();
    }

    function supportsFactoryInterface() public pure override returns (bool) {
        return true;
    }

    function numOptions() public pure override returns (uint256) {
        return NB_OF_TOKENS;
    }

    function canMint(uint256 _optionId) public view override returns (bool) {
        return gsat.canMint(_optionId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < NB_OF_TOKENS, "GSATFactory: URI query for nonexistent token");

        string(abi.encodePacked("ipfs://QmVdg3r6i3Respr9SXZoP8iDJC95yhSXzwkWL2LfzbpzZx/", tokenId.toString()));
    }

    function mint(uint256 _optionId, address _toAddress) external override {
        address sender = _msgSender();
        address owner = owner();

        require(sender == registry.proxies(owner) || sender == owner, "GSATFactory: must be owner's proxy or owner to mint");
        require(canMint(_optionId), "GSATFactory: unavailable token");

        gsat.mint(_toAddress, _optionId);
    }
    // function mint() external {
    //     uint256 supply = totalSupply();
    //     require(supply < 500, "Greatest: well tried, friend");
    //     uint256 max = supply == 0 ? 250 : 500;

    //     for (uint256 i = supply + 1; i <= max; i++) {
    //         _mint(_creator, i);
    //     }
    // }
}
