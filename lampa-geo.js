(function () {
    'use strict';

    // ფუნქცია, რომელიც აჩვენებს ქართულ წყაროებს
    function showGeorgianSources(movieData) {
        var title = movieData.original_title || movieData.title;
        var year = new Date(movieData.release_date || movieData.first_air_date).getFullYear();

        // ვქმნით მენიუს, რომელიც ეკრანზე ამოვარდება
        Lampa.Select.show({
            title: 'ქართული სერვერები',
            items: [
                {
                    title: 'MyKadri (ტესტირება)',
                    subtitle: year + ' • 1080p • ქართული დუბლიაჟი',
                    url: 'https://demo.unified-streaming.com/kaltura/the-secret-life-of-pets.isml/.m3u8' // სატესტო ვიდეო
                }
            ],
            onSelect: function (item) {
                // როცა მომხმარებელი აირჩევს ფილმს, ირთვება პლეერი
                Lampa.Player.play({
                    url: item.url,
                    title: title
                });
                Lampa.Player.playlist([item]);
            },
            onBack: function () {
                Lampa.Controller.toggle('full_start');
            }
        });
    }

    // პლაგინის ინტეგრაცია ლამპას ინტერფეისში
    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ფილმები ქართულად',
            auth: false,
            start: function () {
                // ვუსმენთ ფილმის აღწერის გვერდის ჩატვირთვას
                Lampa.Events.on('activity', function (event) {
                    if (event.component === 'full' && event.type === 'start') {
                        var activity = event.target;
                        
                        // ვქმნით პატარა მწვანე ღილაკს, რომელიც ჩაჯდება სანიშნეების (Bookmark) გვერდით
                        var geoButton = $('<div class="full-start__button selector button--geo-sources" style="background: #00b060; color: #fff; font-weight: bold; padding: 10px 15px; border-radius: 6px; margin-left: 10px; display: inline-flex; align-items: center; cursor: pointer;"><span style="font-size: 14px;">GEO</span></div>');
                        
                        // როცა ღილაკს დავაჭერთ
                        geoButton.on('hover:enter', function () {
                            showGeorgianSources(activity.data);
                        });

                        // ველოდებით სანამ ინტერფეისი სრულად აიგება და ჩავამატებთ ღილაკს
                        setTimeout(function() {
                            var buttonsContainer = activity.dom.find('.full-start__buttons');
                            if (buttonsContainer.length > 0 && activity.dom.find('.button--geo-sources').length === 0) {
                                buttonsContainer.append(geoButton);
                            }
                        }, 500);
                    }
                });
            }
        });
    }
})();
