var utils = {
    range:(size) => {
        let arr = [];
        for(let i=1;i<=size;i++){
            arr.push(i);
        }
        return arr;
    },
    shuffle: (arr) => {
        let len = arr.length;
        for(let i=0;i<len;i++){
            let rnd = Math.floor(Math.random()*len);
            utils.swap(arr,i,rnd);
        }
    },
    findMid: (a,b,c) => {
        if(a>=b){
            if(a<=c){
                return a;
            }else if(b>=c){
                return b;
            }else{
                return c;
            }
        }else{
            if(a>=c){
                return a;
            }else if(b<=c){
                return b;
            }else{
                return c;
            }
        }
    },
    swap: (arr,from,to) => {
        if(from >arr.length || to > arr.length || from < 0 || to < 0 ){
            throw new Error("index not legal");
        }
        let temp = arr[from];
        arr[from] = arr[to];
        arr[to] = temp;
    },
    insert: (arr,from,to) => {
        while(from !== to){
            if(from < to){
                utils.swap(arr,from,from+1);
                from++;
            }else{
                utils.swap(arr,from,from-1);
                from--;
            }
        }
    },
    getCanvas: (id) => {
        var canvas = document.getElementById(id);
        if(canvas === null || canvas.nodeName.toLowerCase() !== 'canvas') {
            return document.createElement('canvas');
        }
        return canvas;
    }
}

var graph = function(){
    var canvas;
    var ctx;
    var width;
    var height;

    var bgColor = '#333';
    var barColor = '#6cf';
    var highlightColor = '#cf6';

    return {
        init: (c) => {
            canvas = c;
            ctx = canvas.getContext("2d");
            width = canvas.offsetWidth;
            height = canvas.offsetHeight; 
        },
        draw: (highlightIndexes,values) =>{
            ctx.fillStyle = bgColor;
            ctx.fillRect(0,0,width,height);
            var idx1 = highlightIndexes[0];
            var idx2 = highlightIndexes[1];

            var size = values.length;
            var barWidth = (width - size + 1) / size;
            var barHeightUnit = height / size;

            var x = 0;
            var h = 0;
            ctx.fillStyle = barColor;
            for(var i = 0; i < values.length; i++) {
                h = values[i] * barHeightUnit;
                if(i === idx1 || i === idx2) {
                    ctx.fillStyle = highlightColor;
                    ctx.fillRect(x, height- h, barWidth, h);
                    ctx.fillStyle = barColor;
                } else {
                    ctx.fillRect(x, height- h, barWidth, h);
                }

                x = x + barWidth + 1;
            }
        }
    }
}()

function SortStep(type,indexes){
    this.type = type;
    this.indexes = indexes;
}

SortStep.SWAP = "swap";
SortStep.INSERT = "insert";
SortStep.HIGHLIGHT = "highlight";

SortStep.prototype.run = function(arr){
    if(this.type === SortStep.SWAP){
        utils.swap(arr,this.indexes[0],this.indexes[1]);
    }else if(this.type === SortStep.INSERT){
        utils.insert(arr,this.indexes[0],this.indexes[1]);
        this.indexes[0] = -1
    }
}

function SortAlgorithm(values) {
    this.values = values;
    this.size = values.length;
    this.steps = [];
    this.finished = false;
}

SortAlgorithm.prototype.sort = function(algorithm) {
    this[algorithm]();
    this.steps.reverse();
    this.finished = true;
};

SortAlgorithm.prototype.addStep = function(type,indexes){
    this.steps.push(new SortStep(type,indexes));
}

SortAlgorithm.prototype.swap = function(from,to){
    utils.swap(this.values,from,to);
    this.addStep(SortStep.SWAP,[from,to]);
}

SortAlgorithm.prototype.highlight = function(from,to){
    this.addStep(SortStep.HIGHLIGHT,[from,to]);
}

SortAlgorithm.prototype.insert = function(from,to){
    utils.insert(this.values,from,to);
    this.addStep(SortStep.INSERT,[from,to]);
}

SortAlgorithm.prototype.bubble = function(){
    let len = this.size;
    for(let i=len-1;i>0;i--){
        for(let j=0;j<i;j++){
            if(this.values[j]>this.values[j+1]){
                this.swap(j,j+1);
            }else{
                this.highlight(j,j+1);
            }
        }
    }
}

SortAlgorithm.prototype.selection = function(){
    let len = this.size;
    for(let i=0;i<len;i++){
        let minIndex = i;
        for(let j=i+1;j<len;j++){
            this.highlight(minIndex,j);
            if(this.values[j]<this.values[minIndex]){
                minIndex = j;
            }
        }
        this.swap(minIndex,i);
    }
}

SortAlgorithm.prototype.insertion = function(){
    let temp;
    for(let i=1;i<this.size;i++){
        for(let j=i;j>0;j--){
            if(this.values[j-1]>this.values[j]){
                this.swap(j,j-1);
            } else{
                this.highlight(j,j-1);
                break;
            }
        }
    }
}

SortAlgorithm.prototype.quickSort = function(){
    this.quickSortImpl(0,this.size-1);
}

SortAlgorithm.prototype.quickSortImpl = function(left,right){
    let values = this.values;
    let middle = parseInt((left+right)/2) || 0;
    let pivot = utils.findMid(values[left],values[middle],values[right]);
    let l = left;
    let r = right;
    while(true){
        while(values[l]<pivot){
            this.highlight(l,r);
            l++;
        }
        while(values[r]>pivot){
            this.highlight(l,r);
            r--;
        }
        if(l>=r){
            break;
        }
        this.swap(l,r);
        r--;
        l++;
    }
    if(left < l-1){
        this.quickSortImpl(left,l-1);
    }
    if(right > r + 1){
        this.quickSortImpl(r+1,right);
    }
}

SortAlgorithm.prototype.mergeSort = function(){
    this.mergeSortImpl(0,this.size-1);
}

SortAlgorithm.prototype.mergeSortImpl = function(left,right){
    if(left >= right){
        return;
    }
    let mid = Math.floor((left+right)/2);
    this.mergeSortImpl(left,mid);
    this.mergeSortImpl(mid+1,right);

    let l = left;
    let m = mid+1;
    while(l<m && m<=right){
        this.highlight(l,m);
        if(this.values[l]>=this.values[m]){
            this.insert(m,l);
            m++;
        }
        l++;
    }
}

SortAlgorithm.prototype.heapSort = function(){
    // create heap
    this.heapify(this.size);
    // 排序
    for(let j = this.size;j>0;j--){
        this.swap(0,j-1);
        this.adjustHeap(0,j-2);
    }

}

SortAlgorithm.prototype.adjustHeap = function(i,end){
    let values = this.values;
    for(let k=2*i+1;k<=end;k=2*k+1){
        if(k+1 <= end && values[k+1] > values[k]) k++;
        if(values[k]<values[i]){
            this.highlight(i,k);
            break;
        }else{
            this.swap(i,k);
            i=k;
        }
    }
}

SortAlgorithm.prototype.heapify = function(length){
    for(let i= Math.floor(length/2)-1;i>=0;i--){
        this.adjustHeap(i,length-1);
    }
}

var timer = null;

var app = new Vue({
  el: '#app',
  data: {
    speed: 10,
    size:100,
    arr: [],
    algorithms: ["bubble","selection","insertion","quickSort","mergeSort","heapSort"],
    selectedAlgorithm: "bubble",
    totalSteps:0
  },
  computed: {
      intervalTime: function(){
          let speed = parseInt(this.speed);
        //   return 0 ;
          return 2000 / speed || 0;
      }
  },
  created:function(){
      this.arr = utils.range(this.size);
      utils.shuffle(this.arr);

  },
  mounted:function(){
      let canvas = utils.getCanvas("canvas");
      graph.init(canvas);
      graph.draw([-1,-1],this.arr);
  },
  methods:{
      start: function(){
          timer && clearTimeout(timer);
          this.totalSteps = 0;
          utils.shuffle(this.arr);
          let self = this;
          let arr2 = this.arr.slice();
          let sortAlgorithm = new SortAlgorithm(self.arr.slice());
          sortAlgorithm.sort(this.selectedAlgorithm);
          function animateFrame(){
              if(sortAlgorithm.steps.length === 0){
                  graph.draw([-1,-1],arr2);
                  return;
              }
              let step = sortAlgorithm.steps.pop();
              self.totalSteps += 1;
              step.run(arr2);
              graph.draw(step.indexes,arr2);
              timer = setTimeout(animateFrame,self.intervalTime);
          }
          setTimeout(animateFrame,0);
      },
      changeSpeed: function(speed){
          this.speed = speed
      }

  }
})

