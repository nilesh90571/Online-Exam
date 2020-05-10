function* autoGen() {
  var counter = 100;
  while (1) {
    yield counter;
    counter++;
  }
}
