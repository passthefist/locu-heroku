//requires underscore, jQuery

function toh(arr){
  return _.chain(arr)
    .map(function(elem){
      console.log(this)
      return $(elem)[0].outerHTML;
    })
    .compact()
    .reduce(function(memo, elem){
      return memo + elem;
    })
    .value();
};

function Namespace(name,func){
  $(function(){
    window[name] = func();
    if(window[name].init) {
      window[name].init()
    }
  });
}

function AsyncCall(context, func) {
  var argQueue = [];
  var ready = false;

  this.push = function() {
    argQueue.push(arguments);
    if(ready){
      this.call()
    }
  }

  this.call = function() {
    ready = true;
    while(argQueue.length > 0){
      func.apply(context, argQueue.pop());
    }
  }
}

function Callbacks(){
  var funcs = [];

  this.add = function(func) {
    funcs.push(func);
  };

  this.invoke = function() {
    var args = arguments;
    _.each(funcs, function(f) {
      f.apply(context, args);
    });
  }
}

