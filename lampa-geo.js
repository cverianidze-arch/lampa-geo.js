(function () {
    'use strict';

    function GeoSourcesPlugin(component) {
        var movieObject = component.activity.data; 

        this.search = function () {
            // ვიღებთ ორიგინალ სახელს და წელს ლამპას ბაზიდან
            var title = movieObject.original_title || movieObject.title;
            var year = new Date(movieObject.release_date || movieObject.first_air_date).getFullYear();

            // საიტების API მისამართები (მაგალითისთვის Mykadri და Ge.movie)
            // შენიშვნა: CORS ბლოკირების ასარიდებლად ბრაუზერში, რეალურ პლაგინს სჭირდება პროქსი (მაგ. cors-anywhere)
            var sources = [
                {
                    name: 'MyKadri',
                    searchUrl: 'https://api.mykadri.tv/v1/search?query=' + encodeURIComponent(title)
                },
                {
                    name: 'GeMovie',
                    searchUrl: 'https://ge.movie/api/search?q=' + encodeURIComponent(title)
                }
            ];

            // სათითაოდ ვამოწმებთ საიტებს
            sources.forEach(function(source) {
                $.ajax({
                    url: source.searchUrl,
                    method: 'GET',
                    success: function (response) {
                        // აქ იწერება კონკრეტული საიტის პასუხის დამუშავება
                        // მაგალითად, თუ საიტმა დააბრუნა ვიდეოს ID და ლინკი:
                        
                        var resultStream = {
                            title: source.name + ' (' + year + ')',
                            url: 'https://სერვერის-მისამართი/putput.m3u8', // აქ ჩაჯდება დინამიური .m3u8 ლინკი
                            quality: '1080p',
                            language: 'GEO'
                        };

                        // ვამატებთ სტრიმს ლამპას სიაში
                        var streams = [resultStream];
                        component.addStream(streams);
                    },
                    error: function() {
                        console.log(source.name + '-ზე ფილმი ვერ მოიძებნა ან სერვერი მიუწვდომელია.');
                    }
                });
            });
        };
    }

    // პლაგინის რეგისტრაცია ლამპას სისტემაში
    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ქართული საიტების ძებნა (Mykadri, Geosaitebi, GeMovie, Kinoflix)',
            auth: false,
            start: function () {
                Lampa.Events.on('view_sources', function (event) {
                    var plugin = new GeoSourcesPlugin(event.component);
                    plugin.search();
                });
            }
        });
    }
})();