function getData() {
    return Math.random();
}

Plotly.plot('chart', [{
    y: [getData()],
    type: 'line',

}]);

setInterval(function(){

    
    Plotly.extendTraces('chart', { y:[[getData()]]}, [0]);
},200);