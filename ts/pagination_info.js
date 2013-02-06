var ReadiumSdk;
(function (ReadiumSdk) {
    var PaginationInfo = (function () {
        function PaginationInfo(visibleColumnCount, columnGap) {
            self.visibleColumnCount = visibleColumnCount;
            self.columnGap = columnGap;
        }
        return PaginationInfo;
    })();    
})(ReadiumSdk || (ReadiumSdk = {}));
