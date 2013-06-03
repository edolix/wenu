var docs_dir = '', www_dir = '';
var config = {}, first_launch = true;
var app = {
  initialize: function(){
    this.bindEvents();
  },
  // Bind Event Listeners
  bindEvents: function() {
    $(document).on({
      mobileinit:this.onMobileInit,
      pageinit:this.onPageInit,
      deviceready:this.onDeviceReady,
      pagebeforeshow:this.onPageBeforeShow,
      pagebeforechange:this.onPageBeforeChange,
      pagebeforehide:this.onPageBeforeHide,
      pageshow:this.onPageShow
    });
    $(this.onReady);
  },
  onDeviceReady: function(){
//    loadConfig();
    window.localStorage.clear(); //clear LocalStorage!
//    loadDocumentsDir();
  },
  onReady:function(){
    esempio();
  },
  onMobileInit:function(){
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slide';
  },
  onPageBeforeShow:function(event, prevObj){ },
  onPageShow:function(){ },
  onPageInit:function(){
    /* Setup default ajax */
    $.ajaxSetup({
      async: true,
      dataType:'json',
      beforeSend: function(jqXHR, settings) {
        if( settings.type == 'POST' ){
//          settings.data += '&app_id='+config.app_id;
        }
        return true;
      },
      error:function(xhr, t, text){
        if( t == 'timeout' ){
          navigator.notification.alert('La richiesta è andata in timeout. Riprovare tra qualche minuto.', function(){}, 'Attenzione!');
        }
        loopError(xhr);
        console.log(text);
      }
    });
    $('[data-role=header], [data-role=footer]').fixedtoolbar({ tapToggle: false });
  },
  onPageBeforeHide:function(){
    $('.loading').show();
  },
  onPageBeforeChange:function(e, data){
    if( typeof(data.toPage) === 'string' ){
      var object_url = $.mobile.path.parseUrl(data.toPage);
      if( object_url.search != '' ){
        var prefix = '';
        if( $.mobile.activePage.attr('id') == 'index' ){
          prefix = docs_dir;
        }
        var params = object_url.search.replace(/^\?/, '').split('&');
        var p = {};
        $.each(params, function(k, v){
          var x = v.split('=');
          p[x[0]] = x[1];
        });
        var current_page = $.mobile.activePage.attr('id');
        var nomepage = object_url.filename.replace('.html', '');
        var options = {};
        if( current_page == nomepage ){
          options = {allowSamePageTransition:true, reloadPage:true};
        }
        window.localStorage.setItem("params_"+nomepage, JSON.stringify(p));
        $.mobile.changePage(prefix+object_url.filename, options);
        e.preventDefault();
      }
    }
  }
};

function esempio()
{
  $.ajax({
    url:'boh.html',
    dataType:'html',
    async:false,
    success:function(html){
      obj_replace = {
         '#NOME#':'Edo',
         '#ANNI#':'21',
         '#BESTEMMIA#':'Dio cane! =)'
      };
      html = replaceData(html, obj_replace);
      console.log(html);
      $('#esempio').html(html);
    }
  });
}

function replaceData(str, obj)
{
  $.each(obj, function(search, replace){
    var r = new RegExp(search, 'g');
    str = str.replace(r, replace);
  });
  return str;
}

function getDatabase()
{
  return window.openDatabase("custom", "3.6", "Custom", 3000000);
}

function loadConfig()
{
  $.ajax({
    url:'./config.json',
    success:function(data){
      config = data;
    }
  });
}

function loadDocumentsDir()
{
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
    docs_dir = fs.root.fullPath+'/';
  });
  
  var path = window.location.pathname;
  var match = path.match(/www\/(.*.html)$/);
  www_dir = path.replace(match[1], '');
}

function loopError(e)
{
  console.log('LoopError!');
  $.each(e, function(k, v){
    console.log(k+' -> '+v);
  });
}

/* Network State */
function checkNetwork()
{
	if( navigator.network ){
		switch( navigator.connection.type )
		{
			case Connection.UNKNOWN:
			case Connection.NONE:
				return false;
      break;
		}
	}
	return true;
}

function getFromLocalStorage(key, index_of_array, type)
{
  var index_of_array = index_of_array || 0;
  var type = type || 'json';
  var val = window.localStorage.getItem(key) || "";
  if( !val ){
    if( type == 'json' ){
      return {};
    }
    return "";
  }
  if( type && type == 'json' ){
    val = JSON.parse(val);
    if( index_of_array != 0 ){
      if( val[index_of_array] == undefined ){
        return false;
      }
      val = val[index_of_array];
    }
  }
  return val;
}
app.initialize();