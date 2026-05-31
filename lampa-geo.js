(function () {
    'use strict';

    function GeoSourcesPlugin(component) {
        var movieObject = component.activity.data; 

        this.search = function () {
            // ვიღებთ ფილმის სახელს ლამპას ბაზიდან
            var title = movieObject.original_title || movieObject.title;
            var year = new Date(movieObject.release_date || movieObject.first_air_date).getFullYear();

            // მოთხოვნა იგზავნება MyKadri-ს ძებნის API-ზე
            // (რეალურ პირობებში შეიძლება დაგჭირდეს პროქსის მიწერა URL-ის წინ)
            var searchUrl = 'https://api.mykadri.tv/v1/search?query=' + encodeURIComponent(title);

            $.ajax({
                url: searchUrl,
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    // response არის ის, რასაც საიტი გვიბრუნებს.
                    // ვუშვებთ, რომ საიტი აბრუნებს მასივს (შედეგებს)
                    if (response && response.length > 0) {
                        
                        // ვეძებთ პირველ ფილმს, რომელიც წლით ემთხვევა
                        var foundMovie = response.find(function(item) {
                            return item.year == year;
                        }) || response[0]; // თუ წლით ვერ იპოვა, ავიღოთ პირველივე

                        // როცა ფილმის ID გვაქვს, MyKadri-ს წესით სჭირდება ვიდეო ფაილის ამოღება.
                        // ვთქვათ, ვიდეოს პირდაპირი ლინკი ასე იწყობა მათი სერვერიდან:
                        var videoUrl = 'https://node.mykadri.tv/hls/' + foundMovie.id + '/master.m3u8';

                        var streams = [
                            {
                                title: 'MyKadri (ქართულად)',
                                url: videoUrl,
                                quality: '1080p',
                                language: 'GEO'
                            }
                        ];

                        // აი ამ მომენტში ლამპა დაინახავს რეალურ ობიექტს და გამოაჩენს ონლაინ ღილაკს!
                        component.addStream(streams);
                    }
                },
                error: function() {
                    console.log('MyKadri-ზე ფილმი ვერ მოიძებნა.');
                }
            });
        };
    }

    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ქართული საიტების ძებნა',
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