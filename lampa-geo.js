(function () {
    'use strict';

    function GeoSourcesPlugin(component) {
        var movieObject = component.activity.data; 

        this.search = function () {
            var title = movieObject.original_title || movieObject.title;
            var year = new Date(movieObject.release_date || movieObject.first_air_date).getFullYear();

            // 1. პირველ ეტაპზე, მოდი იძულებით მივაწოდოთ ლამპას ერთი მუშა სტრიმი,
            // რათა დავინახოთ, რომ საერთოდ ჩნდება სიაში მაიკადრის ღილაკი.
            var testStream = {
                title: 'MyKadri (ტესტი ჩაიტვირთა)',
                url: 'https://demo.unified-streaming.com/kaltura/the-secret-life-of-pets.isml/.m3u8', // სატესტო მუშა ვიდეო
                quality: '1080p',
                language: 'GEO'
            };

            // იძულებით ვახატავინებთ ღილაკს
            component.addStream([testStream]);

            // 2. პარალელურად ვუშვებთ რეალურ ძებნას მაიკადრიზე პროქსის გავლით
            // (გამოიყენება სატესტო პროქსი corsproxy.io)
            var proxy = "https://corsproxy.io/?";
            var searchUrl = proxy + encodeURIComponent('https://api.mykadri.tv/v1/search?query=' + title);

            $.ajax({
                url: searchUrl,
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (response && response.length > 0) {
                        // თუ რეალურად იპოვა ფილმი, დაამატებს მეორე, ნამდვილ ღილაკსაც
                        var realStream = {
                            title: 'MyKadri: ' + response[0].title,
                            url: 'https://node.mykadri.tv/hls/' + response[0].id + '/master.m3u8',
                            quality: '720p',
                            language: 'GEO'
                        };
                        component.addStream([realStream]);
                    }
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
