

module ReadiumSdk {

    class PaginationInfo {

        public visibleColumnCount : number;
        public columnGap : number;
        public pageCount : number;
        public currentPage : number;
        public columnWidth : number;

        constructor(visibleColumnCount : number, columnGap : number)
        {
            self.visibleColumnCount = visibleColumnCount;
            self.columnGap = columnGap;
        }

    }
}