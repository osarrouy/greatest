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

    GSAT public token;
    IProxyRegistry public registry;

    constructor(GSAT _token, IProxyRegistry _registry) {
        // we do not check addresses to save gas
        token = _token;
        registry = _registry;
    }

    function name() public view override returns (string memory) {
        return token.name();
    }

    function symbol() public view override returns (string memory) {
        return token.symbol();
    }

    function numOptions() public view override returns (uint256) {
        return token.cap();
    }

    function supportsFactoryInterface() public pure override returns (bool) {
        return true;
    }

    function canMint(uint256 _optionId) public view override returns (bool) {
        return token.canMint(_optionId);
    }

    function tokenURI(uint256 _optionId) public view override returns (string memory) {
        require(_optionId < token.cap(), "GSATFactory: URI query for nonexistent token");

        return string(abi.encodePacked(token.baseTokenURI(), _optionId.toString()));
    }

    function mint(uint256 _optionId, address _toAddress) external override {
        address sender = _msgSender();
        address owner = owner();

        require(sender == registry.proxies(owner) || sender == owner, "GSATFactory: must be owner's proxy or owner to mint");
        require(canMint(_optionId), "GSATFactory: unavailable token");

        token.mint(_toAddress, _optionId);
    }
}
