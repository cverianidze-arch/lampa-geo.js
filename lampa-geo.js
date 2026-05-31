(function () {
    'use strict';

    // ფუნქცია, რომელიც რთავს ვიდეოს
    function playGeoMovie(movieData) {
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
    }

    // პლაგინის გაშვება
    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ფილმები ქართულად',
            auth: false,
            start: function () {
                // ტესტირებისთვის: ლამპას ჩართვისას ეგრევე ამოაგდებს შეტყობინებას
                setTimeout(function() {
                    Lampa.Noty.show('ქართული პლაგინი წარმატებით ჩაიტვირთა!');
                }, 2000);

                // ვამატებთ ახალ ჩანართს (Tab) ფილმის შიდა მენიუში
                Lampa.Events.on('activity', function (event) {
                    if (event.component === 'full' && event.type === 'start') {
                        var activity = event.target;
                        
                        // ვამატებთ ახალ პუნქტს მენიუში (მსახიობების და მსგავსი ფილმების გვერდით)
                        activity.page.items.push({
                            title: 'ყურება ქართულად',
                            id: 'geo_online',
                            onSelect: function() {
                                playGeoMovie(activity.data);
                            }
                        });
                    }
                });
            }
        });
    }
})();
