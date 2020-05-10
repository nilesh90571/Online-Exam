const questionOperations = {
  operations: [],
  add(questionObject) {
    this.operations.push(questionObject);
  },
  idValue() {
    var obj = this.operations[this.operations.length - 1];
    var t = parseInt(obj.id) + 1;
    return t;
  },
  toggleMark(id) {
    var questionObject = this.operations.find(question => question.id == id);
    questionObject.markForDelete = !questionObject.markForDelete;
  },
  countMark() {
    return this.operations.filter(question => question.markForDelete == true)
      .length;
  },
  sort(type, val) {
    if (type == "1") {
      return this.operations.sort((a, b) => a[val].localeCompare(b[val]));
    } else {
      return this.operations.sort((a, b) => b[val].localeCompare(a[val]));
    }
  },
  update(id, questionObject) {
    var data = this.find(id);
    var index = this.operations.indexOf(data);
    this.operations[index] = questionObject;
  },
  search(key, value) {
    if (!value) {
      return this.operations;
    }
    return this.operations.filter(question => question[key] == value);
  },
  find(id) {
    return this.operations.find(question => question.id == id);
  },

  remove() {
    this.operations = this.operations.filter(
      question => !question.markForDelete
    );
  }
};
