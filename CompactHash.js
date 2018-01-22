window.compactHash = (function () {
    const _paramStart = "/c_h_/";
    const _paramStartLength = _paramStart.length;
    const _paramEnd = "/_c_h/";
    const _paramEndLength = _paramEnd.length;

    const _setPrototypeKey = "Hash.prototype.set";
    const _getPrototypeKey = "Hash.prototype.get";
    const _setKey = "set";
    const _getKey = "get";
    var _instance = new CompactHash();
    var _registerMap = [];
    var _valueMap = [];
    var _id = 0;
    var _settings;

    if (("onhashchange" in window)) {
        $(window).bind('hashchange', _onHashChange.bind(this));
    } else {
        $('a.hash-changer').bind('click', _onHashChange.bind(this));
    }

    function CompactHash() { }

    function _setHash(hash) {
        window.location.hash = hash;
    }

    function _appendHash(hash) {
        window.location.hash = window.location.hash + hash;
    }

    function _getHash() {
        return window.location.hash;
    }

    function _firstLettterToUpperCase(value) {
        return value && value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    function _cleanUpHashName(hashName) {
        hashName = hashName.replace(/[^0-9A-Za-z]+/g, "");
        return hashName;
    }

    function _startsWithDigit(hashName) {
        return hashName.match(/^[\d]/);
    }

    function _setHashValue(pId, value) {
        _valueMap[pId] = encodeURI(value);
        _setHash(_buildHash());

    }

    function _buildHash() {
        var hashes = "";
        var len = _valueMap.length - 1;
        _valueMap.forEach(function (value, idx) {
            if (idx < len) {
                hashes = hashes + value + ",";
            } else {
                hashes = hashes + value;
            }
        });
        return _paramStart + hashes + _paramEnd;

    }

    function _getHashValue(pId) {
        return decodeURI(_valueMap[pId]);
    }

    function _parseHash(hash) {
        if (!hash) {
            return;
        }
        var _start = hash.indexOf(_paramStart);
        var _end = hash.indexOf(_paramEnd);
        if (_start > -1 && _end > -1) {
            var _compactHash = hash.substring(_start + _paramStartLength, _end);
            if (_compactHash) {
                var _aHash = _compactHash.split(",");
                _aHash.forEach(function (part, idx) {
                    var _lastValue = _valueMap[idx];
                    if (_lastValue !== part) {
                        _valueMap[idx] = part;
                        var _registered = _registerMap[idx];
                        if (_registered.onChanged) {
                            _registered.onChanged(decodeURI(part));
                        }
                    }
                });
            }
        }
    }

    function _onHashChange() {
        var _hash = _getHash();
        _parseHash(_hash);
    }

    function _alreadyPresent(hashName) {
        return _registerMap.some(function (registered) {
            return registered.name === hashName;
        });
    }

    function _unregister(hashName) {
        var _pName = _firstLettterToUpperCase(_cleanUpHashName(hashName));
        var _index = -1;
        if (_alreadyPresent(_pName)) {
            _registerMap.forEach(function (registered, idx) {
                if (registered.name === _pName) {
                    _index = idx;
                }
            });
            if (_index > -1) {
                _registerMap.splice(_index, 1);
                eval("delete " + _setPrototypeKey + _pName);
                eval("delete " + _getPrototypeKey + _pName);
            }
        } else {
            throw new IllegalArgumentException("Hash name was not found in register.");
            return;
        }
    }
    function _register(hashName, onChangedListener) {
        var _pId = _id++;
        var _pName = _cleanUpHashName(hashName);
        if (_pName !== hashName) {
            throw new IllegalArgumentException("Hash name has not supported characters. Only 0-9, a-z, A-Z are supported.");
            return;
        }
        _pName = _firstLettterToUpperCase(_pName);
        if (_pName && _startsWithDigit(_pName)) {
            throw new IllegalArgumentException("Hash name should not beginn with a digit. Please use A-Z as first letter.");
            return;
        }

        if (_alreadyPresent(_pName)) {
            throw new IllegalArgumentException("Hash name already present and registered. \
                Please use unregister to remove the registration before re-registering the name '" + hashName + "'.");
            return;
        }

        eval(_setPrototypeKey + _pName + " = function(value){_setHashValue('" + _pId + "', value)};");
        eval(_getPrototypeKey + _pName + " = function(){return _getHashValue('" + _pId + "')};");
        var _toRegister = {
            id: _pId,
            name: _pName,
            onChanged: onChangedListener
        };
        eval("_toRegister." + _setKey + "=_instance." + _setKey + _pName);
        eval("_toRegister." + _getKey + "=_instance." + _getKey + _pName);
        _registerMap[_pId] = _toRegister;
    }

    function _initialize(settings) {
        _settings = $.extend({}, settings);
        if (_settings.params) {
            _settings.params.forEach(function (param) {
                _register(param.hashName, param.onChangedListener);
            });
            _parseHash(_getHash());
        }
    }


    CompactHash.prototype.initialize = _initialize;

    CompactHash.prototype.unregister = _unregister;

    CompactHash.prototype.register = _register;

    function IllegalArgumentException(message) {
        this.message = message;
        this.name = "IllegalArgumentException";
    }

    return _instance;
}());
