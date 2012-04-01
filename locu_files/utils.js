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

function defer(func){
  setTimeout(func,100);
}

function AsyncCall(context, func) {
  var argQueue = [];
  var ready = false;
  var afters = [];
  
  this.push = function() {
    argQueue.push(arguments);
    if(ready){
      this.call()
    }
    return {
      after: function(afterFunc) {
        afters.push(afterFunc);
      }
    }
  }

  this.call = function() {
    while(argQueue.length > 0){
      func.apply(context, argQueue.pop());
    }
    while(afters.length > 0){
      afters.pop().call();
    }
    ready = true;
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

