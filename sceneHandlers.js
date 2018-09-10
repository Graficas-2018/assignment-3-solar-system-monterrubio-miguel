
// An integer value, in pixels, indicating the X coordinate at which the mouse pointer was located when the event occurred. 
var mouseLeft = false, mouseRight = false, pageX = 0, pageY = 0;

function rotateScene(deltax, deltay)
{
    solarSystem.rotation.y += deltax / 100;
    solarSystem.rotation.x += deltay / 100;
    $("#rotation").html("rotation: " + solarSystem.rotation.x.toFixed(1) + ", " + solarSystem.rotation.y.toFixed(1) + ",0");
}

function scaleScene(scale)
{
    solarSystem.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}

function scrollScene(event)
{
    if (event.deltaY < 0) {
        duration -= 300;
        if(duration < 100)
            duration = 100;
        console.log(duration);
    }
    else
    {
        
        duration += 300;
        console.log(duration);
    }
}

function moveScene(deltax, deltay)
{
    camera.translateX(-deltax/73);
    camera.translateY(deltay/73);
}

function onMouseMove(evt)
{
    //No action if no mouse button pressed
    if (!mouseLeft && !mouseRight)
        return;
    
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    evt.preventDefault();
    
    if(mouseLeft && !mouseRight)
    {
        var deltax = evt.pageX - pageX;
        var deltay = evt.pageY - pageY;

        pageX = evt.pageX;
        pageY = evt.pageY;
        rotateScene(deltax, deltay);
    }

    if(mouseRight && !mouseLeft)
    {
        var deltax = evt.pageX - pageX;
        var deltay = evt.pageY - pageY;

        pageX = evt.pageX;
        pageY = evt.pageY;
        moveScene(deltax, deltay);
    }

    
}

function onMouseDown(evt)
{
    evt.preventDefault();
    
    switch(event.button)
    {
        case 0: // left click
            mouseLeft = true;
            break;
        case 1: // middle click. "Pauses" animation (just makes it really slow)
            //pause = !pause;          
            duration = 1;  
            break;
        case 2: // right click
            mouseRight = true;
            break;
    }


    
    pageX = evt.pageX;
    pageY = evt.pageY;
}

function onMouseUp(evt)
{
    evt.preventDefault();
    
    switch(event.button)
    {
        case 0: // left click
            mouseLeft = false;
            break;
        case 1: // middle click
            break;
        case 2: // right click
            mouseRight = false;
            break;
    }
}

function addMouseHandler(canvas)
{
    canvas.addEventListener( 'mousemove', 
            function(e) { onMouseMove(e); }, false );
    canvas.addEventListener( 'mousedown', 
            function(e) { onMouseDown(e); }, false );
    canvas.addEventListener( 'mouseup', 
            function(e) { onMouseUp(e); }, false );
    canvas.addEventListener( 'contextmenu', event => event.preventDefault());
    canvas.addEventListener( 'wheel', 
            function(e) { scrollScene(e); }, false)

}

