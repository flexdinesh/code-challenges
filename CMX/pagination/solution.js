// TODO: complete this object/class

// The constructor takes in an array of items and a integer indicating how many
// items fit within a single page
function PaginationHelper(collection, itemsPerPage) {
  this.collection = collection;
  this.pageSize = itemsPerPage;
}

// returns the number of items within the entire collection
PaginationHelper.prototype.itemCount = function() {
  return this.collection.length;
};

// returns the number of pages
PaginationHelper.prototype.pageCount = function() {
  const quotient = this.itemCount() / this.pageSize;
  const reminder = this.itemCount() % this.pageSize;
  return reminder <= 0 ? Math.floor(quotient) : Math.floor(quotient + 1);
};

// returns the number of items on the current page. page_index is zero based.
// this method should return -1 for pageIndex values that are out of range
PaginationHelper.prototype.pageItemCount = function(pageIndex) {
  const lastPageIndex = this.pageCount() - 1;
  const hasLeftOverLastPage = this.itemCount() % this.pageSize > 0;

  if (pageIndex > lastPageIndex) return -1;

  if (pageIndex < lastPageIndex) return this.pageSize;
  else if (hasLeftOverLastPage && pageIndex === lastPageIndex)
    return this.itemCount() % this.pageSize;
  else if (!hasLeftOverLastPage && pageIndex === lastPageIndex)
    return this.pageSize;
  else return -1;
};

// determines what page an item is on. Zero based indexes
// this method should return -1 for itemIndex values that are out of range
PaginationHelper.prototype.pageIndex = function(itemIndex) {
  if (itemIndex >= this.itemCount() || itemIndex < 0) return -1;
  return Math.floor(itemIndex / this.pageSize);
};
