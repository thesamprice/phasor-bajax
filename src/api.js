var Phasor = function()
{

  this.host_address = document.location.hostname;
  this.write_stream = new DataStream(new Uint8Array(1024*512));


}


function StructToBinary(struct, ds)
{
    var arr = new Uint8
    DataStream.memcpy(this._buffer, this.byteOffset+this.position,
                      arr.buffer, 0,
                      arr.byteLength);
}

$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob)))))
    {

        return {
            // create new XMLHttpRequest
            send: function(_, callback){
                // setup all variables
                var xhr = new XMLHttpRequest(),
                    url = options.url,
                    type = options.type,

                    // blob or arraybuffer. Default is blob
                    dataType = options.responseType || "blob",
                    data = options.data || null;

                    xhr.addEventListener('load', function(){
                    var data = {};
                    data[options.dataType] = xhr.response;
                    // make callback and send data

                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, true);
                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});





Phasor.prototype.GetStruct = function(datatype)
{
    this.write_stream.seek(0)
    return this.write_stream.readStruct(datatype)
}

Phasor.prototype.SendDSType = function(input)
{
    this.write_stream.seek(0);
    var len = this.write_stream.writeStruct(input['data_type'],input['data'])
    this.write_stream.seek(0)
    var binary_data = this.write_stream.readUint8Array(len)

    var request = {
       url: 'http://' + this.host_address + input['short_url'],
       type: 'POST',
       contentType: 'application/octet-stream',
       data: binary_data,
       processData:false,
       crossDomain:true,
       processData:false,
       dataType:'binary'
    }

 var request = $.extend({},input,request)
 $.ajax(request);
}

Phasor.prototype.DSGetRequest = function(input)
{
  var request = {
    type:'GET',
    url:"http://" + this.host_address + input['short_url'],
    crossDomain:true,
    processData:false,
    dataType:'binary',
    responseType:'arraybuffer',
    success: function(dat){
        var ds = new DataStream(dat)
        ds.seek(0)
        var data_type_data =  ds.readStruct(input['data_type'])
        input['success'](data_type_data,input)
    }
 }
 if('get_data_type' in input)
 {
    this.write_stream.seek(0);
    var len = this.write_stream.writeStruct(input['get_data_type'],input['data'])
    this.write_stream.seek(0)
    var binary_data = this.write_stream.readUint8Array(len)
    input = $.extend({},input,{'data':binary_data})
 }


 var request = $.extend({},input,request)
 $.ajax(request);
}
/*!
* @brief Performs a Data stream get request, but not requring a data type to decode the data
*/
Phasor.prototype.DSGetRequestNone = function(input)
{
  var request = {
    type:'GET',
    url:"http://" + this.host_address +input['short_url'],
    crossDomain:true,
    processData:false,
    dataType:'binary',
    responseType:'arraybuffer',
    success: function(dat){
        var ds = new DataStream(dat)
        ds.seek(0)
        input['success'](ds);
    }
 };
 var request = $.extend({},input,request)
 $.ajax(request);
}
