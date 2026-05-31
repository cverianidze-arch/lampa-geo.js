(function () {
    'use strict';

    function playGeoMovie(movieData) {
        try {
            var title = movieData.original_title || movieData.title;
            var year = new Date(movieData.release_date || movieData.first_air_date).getFullYear();

            Lampa.Select.show({
                title: 'ქართული სერვერები',
                items: [
                    {
                        title: 'MyKadri (ტესტირება)',
                        subtitle: year + ' • 1080p • GEO',
                        url: 'https://demo.unified-streaming.com/kaltura/the-secret-life-of-pets.isml/.m3u8'
                    }
                ],
                onSelect: function (item) {
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
        } catch (e) {
            console.log('პლეერის გაშვების შეცდომა:', e);
        }
    }

    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ფილმები ქართულად',
            auth: false,
            start: function () {
                Lampa.Events.on('activity', function (event) {
                    try {
                        if (event.component === 'full' && event.type === 'start') {
                            var activity = event.target;
                            
                            setTimeout(function() {
                                // ვამოწმებთ, რომ საერთოდ არსებობს ინტერფეისის ელემენტები
                                if (activity.dom && activity.dom.find('.full-start__buttons').length > 0) {
                                    if (activity.dom.find('.button--geo-sources').length === 0) {
                                        
                                        var geoButton = $('<div class="full-start__button selector button--geo-sources" style="background: #00b060; color: #fff; font-weight: bold; padding: 10px 15px; border-radius: 6px; margin-left: 10px; display: inline-flex; align-items: center; cursor: pointer;"><span style="font-size: 14px;">GEO</span></div>');
                                        
                                        geoButton.on('hover:enter', function () {
                                            playGeoMovie(activity.data);
                                        });

                                        activity.dom.find('.full-start__buttons').append(geoButton);
                                    }
                                }
                            }, 1000); // 1 წამი დაიცადოს, რომ ინტერფეისი აიგოს
                        }
                    } catch (err) {
                        console.log('ღილაკის ჩახატვის შეცდომა:', err);
                    }
                });
            }
        });
    }
})();
