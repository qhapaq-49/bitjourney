
$(function () {
    chrome.storage.local.get(function(obj) {
	if ("target_color" in obj) {
	    $("input[name='target_color']").val(obj.target_color);
	}
	if ("pixel_size" in obj) {
	    $("input[name='pixel_size']").val(obj.pixel_size);
	}
    if ("border" in obj) {
	    $("input[name='border']").val(obj.border);
	}
    if ("mesh" in obj) {
	    $("input[name='mesh']").val(obj.mesh);
	}
    if ("fig_url" in obj) {
        let elem = document.getElementById("palette");
        elem.src = obj.fig_url;
    }
	$("#register").on("click", function() {
	    update_settings();
	});
    $("#download").on("click", function() {
	    download_image();
	});
    });
});

function download_image(){
    let canvas = document.getElementById("canvas");
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "output.png";
    link.click();
}

function update_settings() {
    let obj = {};
    obj.target_color = $("input[name='target_color']").val();
    obj.pixel_size = $("input[name='pixel_size']").val();
    obj.border = $("input[name='border']").val();
    obj.mesh = $("input[name='mesh']").val();
    const mesh = parseInt(obj.mesh)
    let img = document.getElementById('palette');
    const canvas = document.getElementById("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    let imagedata = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    const out = run_color_reduction(imagedata.data, imagedata.width, imagedata.height, obj.target_color, [mesh, mesh, mesh]);
    let dst = context.createImageData(canvas.width, canvas.height);
    const resize_out = resize_image(out.image_dot_list, imagedata.width, imagedata.height, out.color_list, obj.pixel_size, true, 0.1 * obj.border);
    for(let i=0;i<imagedata.width * imagedata.height * 4;++i){
        dst.data[i] = resize_out[i];
    }
    context.putImageData(dst, 0, 0);

    
    const canvas_out = document.getElementById("canvas_out");
    const context_out = canvas_out.getContext("2d");
    const scale = 400 / img.naturalWidth;
    canvas_out.width = 400;
    canvas_out.height = parseInt(img.naturalHeight * scale);
    context_out.scale(scale, scale);
    context_out.drawImage(canvas, 0, 0);
    

    chrome.storage.local.set(obj, function(){
    });
    
}
