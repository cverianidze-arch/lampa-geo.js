(function () {
    'use strict';

    // ვქმნით ფუნქციას, რომელიც მოძებნის ფილმს
    function GeoBalancer(object) {
        var network = new Lampa.Reguest();
        var scroll  = new Lampa.Scroll({mask:true,over:true});
        var files   = new Lampa.Files(object);
        var filter  = new Lampa.Filter(object);
        
        var title = object.original_title || object.title;
        var year = new Date(object.release_date || object.first_air_date).getFullYear();

        // ეს ფუნქცია აკონტროლებს, რა უნდა მოხდეს როცა ამ ბალანსერს ავირჩევთ
        this.start = function () {
            this.activity.loader(true);

            // სატესტო სტრიმი, რომელსაც პირდაპირ ვაწვდით ლამპას
            var testFolder = {
                title: 'MyKadri (ტესტი)',
                subtitle: year + ' • GEO • 1080p',
                quality: '1080p',
                url: 'https://demo.unified-streaming.com/kaltura/the-secret-life-of-pets.isml/.m3u8',
                timeline: object.timeline
            };

            // ვქმნით სიას მომხმარებლისთვის
            var items = [testFolder];

            // ვთიშავთ ლოადერს და ვხატავთ ფაილს
            this.activity.loader(false);
            
            files.append({
                title: 'ფილმები ქართულად',
                items: items,
                onSelect: function(item) {
                    Lampa.Player.play({
                        url: item.url,
                        title: title
                    });
                    Lampa.Player.playlist([item]);
                }
            });

            this.activity.toggle();
        };

        this.create = function () {
            return scroll.render();
        };

        this.destroy = function () {
            scroll.destroy();
            files.destroy();
        };
    }

    // ეს არის მთავარი ხაზი, რომელიც ლამპას ეუბნება: "დაამატე ახალი წყარო წყაროების სიაში"
    if (window.Lampa) {
        // ვარეგისტრირებთ ახალ კომპონენტს წყაროებისთვის
        Lampa.Component.add('geo_movies', GeoBalancer);

        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ქართული საიტების ძებნა',
            auth: false,
            start: function () {
                // ვამატებთ ღილაკს "Смотреть"-ის დაჭერის შემდგომ მენიუში
                Lampa.Events.on('online', function (event) {
                    event.component.add({
                        title: 'MyKadri', // აი ეს სახელი გამოჩნდება სიაში!
                        component: 'geo_movies'
                    });
                });
            }
        });
    }
})();
