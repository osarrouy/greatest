// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IProxyRegistry.sol";

contract ProxyRegistry is IProxyRegistry {
    mapping(address => address) public _proxies;

    constructor(address proxy) {
        _proxies[msg.sender] = proxy;
    }

    function proxies(address account) external view override returns (address) {
        return _proxies[account];
    }
}
