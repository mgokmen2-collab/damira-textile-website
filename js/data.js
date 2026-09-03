/* COQ D'OR — MAISON DE LINGE
 * Veri Katmanı: 6 Temel Ürün Grubu (Kategoriler) & 25 Bölgesel Fransız Sahil Deseni
 * TR / EN / FR 3 Dilde Tam Destek
 */
(function (global) {
  'use strict';

  /* 1. ÜRÜN GRUPLARI (KATEGORİLER) */
  const CATEGORIES = [
    {
      id: 'bornoz',
      img: 'koleksiyonlar/bornoz/M26_3246.jpg',
      ratio: 4/3,
      tr: 'Bornoz Koleksiyonu',
      en: 'Bathrobe Collection',
      fr: 'Collection Peignoirs',
      d: {
        tr: '%100 saf Ege pamuğu lüks şal yaka havlu, waffle kimono ve nefes alan 4 katlı müslin bornoz modelleri. 5 yıldızlı otel ve spa kalitesi.',
        en: '100% pure Aegean cotton luxury shawl collar terry, waffle kimono, and breathable 4-layer muslin bathrobes. 5-star hotel and spa grade.',
        fr: 'Peignoirs haut de gamme en 100% coton égéen : éponge col châle, kimono nid d’abeille et mousseline 4 épaisseurs. Qualité hôtellerie 5 étoiles et spa.'
      },
      models: [
        { id: 'b1', n: { tr: 'Klasik Şal Yaka Havlu Bornoz', en: 'Classic Shawl Collar Terry Robe', fr: 'Peignoir Éponge Col Châle' }, img: 'koleksiyonlar/bornoz/M26_3246.jpg' },
        { id: 'b2', n: { tr: 'Balpeteği Waffle Kimono Bornoz', en: 'Waffle Honeycomb Kimono Robe', fr: 'Peignoir Kimono Nid d’Abeille' }, img: 'koleksiyonlar/bornoz/M26_3279.jpg' },
        { id: 'b3', n: { tr: '4 Katlı Nefes Alan Müslin Bornoz', en: '4-Layer Breathable Muslin Robe', fr: 'Peignoir Mousseline 4 Épaisseurs' }, img: 'koleksiyonlar/bornoz/M26_3419.jpg' },
        { id: 'b4', n: { tr: 'Kapüşonlu Antrasit Spa Bornozu', en: 'Hooded Charcoal Spa Robe', fr: 'Peignoir Spa à Capuche Anthracite' }, img: 'koleksiyonlar/bornoz/M26_3382.jpg' }
      ]
    },
    {
      id: 'havlu',
      img: 'koleksiyonlar/HAVLU/havlu_1_Traverten_Mermer_Set.jpg',
      ratio: 4/3,
      tr: 'Havlu Koleksiyonu',
      en: 'Towel Collection',
      fr: 'Collection Serviettes',
      d: {
        tr: '550 g/m² yoğun bukle %100 Ege pamuğu banyo ve el havluları. Traverten mermer bordürlü ve waffle gofre nakış bantlı zengin pastel renk paleti.',
        en: '550 g/m² dense-loop 100% Aegean cotton bath and hand towels. Ribbed flat-weave and waffle embroidered border bands in rich pastel hues.',
        fr: 'Serviettes de bain et de toilette en 100% coton égéen 550 g/m². Finitions liteau plat ou gaufré pour broderie, palette raffinée de teintes pastel.'
      },
      models: [
        { id: 'h1', n: { tr: 'Traverten Lüks Banyo & El Havlu Seti', en: 'Travertine Luxury Bath & Hand Set', fr: 'Parure Serviettes Travertin de Luxe' }, img: 'koleksiyonlar/HAVLU/havlu_1_Traverten_Mermer_Set.jpg' },
        { id: 'h2', n: { tr: 'Gofre / Waffle Bordürlü Spa Havlusu', en: 'Waffle Border Ribbed Spa Towel', fr: 'Serviette Spa à Liteau Gaufré' }, img: 'koleksiyonlar/HAVLU/havlu_2_Gofre_Bordurlu.jpeg' },
        { id: 'h3', n: { tr: 'Pastel Nane Yeşili Banyo Havlusu', en: 'Pastel Mint Green Bath Towel', fr: 'Drap de Bain Vert Menthe Pastel' }, img: 'koleksiyonlar/HAVLU/havlu_3_Mint_Yesili_Asili.jpeg' },
        { id: 'h4', n: { tr: 'Pudra Pembe Lüks Banyo Havlusu', en: 'Dusty Rose Blush Bath Towel', fr: 'Drap de Bain Rose Poudré' }, img: 'koleksiyonlar/HAVLU/havlu_4_Pudra_Pembe_Kuvet.jpeg' }
      ]
    },
    {
      id: 'pike',
      img: 'koleksiyonlar/pike/pike_2_Fransiz_Riviera_Sezlong.jpeg',
      ratio: 4/3,
      tr: 'Pike & Yatak Örtüsü',
      en: 'Piqué & Bed Covers',
      fr: 'Piqués & Couvre-Lits',
      d: {
        tr: 'Fransız Riviera villaları ve sahil otelleri için %100 Ege pamuğu balpeteği gofre pikeler. Nefes alan jakar dokuma ve el düğümlü püsküller.',
        en: 'Designed for French Riviera seaside villas: 100% Aegean cotton honeycomb waffle piqués. Breathable jacquard weaves and hand-tied fringed tassels.',
        fr: 'Conçus pour les villas et hôtels de la Côte d’Azur : piqués nid d’abeille en 100% coton égéen. Tissage jacquard respirant et finitions franges nouées main.'
      },
      models: [
        { id: 'pk1', n: { tr: 'Saint-Tropez Şezlong Waffle Pike', en: 'Saint-Tropez Sunbed Waffle Piqué', fr: 'Piqué Transat Saint-Tropez' }, img: 'koleksiyonlar/pike/pike_2_Fransiz_Riviera_Sezlong.jpeg' },
        { id: 'pk2', n: { tr: 'Riviera Sahil Villası Yatak Örtüsü', en: 'Riviera Coastal Villa Bed Cover', fr: 'Dessus de Lit Villa Riviera' }, img: 'koleksiyonlar/pike/pike_1_Villa_Yatak_Odasi_Waffle.jpg' },
        { id: 'pk3', n: { tr: 'Provence Taş Villa Adaçayı Pike', en: 'Provence Manor Sage Green Throw', fr: 'Piqué Vert Sauge Manoir de Provence' }, img: 'koleksiyonlar/pike/pike_3_Provence_Tas_Villa_Yesil.jpeg' },
        { id: 'pk4', n: { tr: 'Makro Lif & Petek Dokuma Detayı', en: 'Macro Honeycomb Weave Detail', fr: 'Détail Tissage Nid d’Abeille' }, img: 'koleksiyonlar/pike/pike_4_Dokuma_Puskul_Detay.jpeg' }
      ]
    },
    {
      id: 'pestemal',
      img: 'koleksiyonlar/pestemal/ca04c60c-7400-46bb-9fad-15a089f6f37f.JPG',
      ratio: 4/3,
      tr: 'Peştemal & Fouta',
      en: 'Foutas & Peshtemals',
      fr: 'Foutas & Peshtemals',
      d: {
        tr: 'Özel plajlar, lüks havuz başları ve yatlar için %100 Ege pamuğu elmas jakar dokumalı peştemaller. Hızlı kuruyan, son derece hafif ve yüksek emici.',
        en: '100% Aegean cotton diamond-jacquard foutas for private beaches, luxury pools and yacht decks. Ultra-light, fast-drying and exceptionally absorbent.',
        fr: 'Foutas en 100% coton égéen à tissage jacquard losange pour plages privées et yachts. Séchage rapide, légèreté et absorption exceptionnelle.'
      },
      models: [
        { id: 'ps1', n: { tr: 'Geleneksel Elmas Jakar Peştemal', en: 'Traditional Diamond Jacquard Fouta', fr: 'Fouta Jacquard Losange Traditionnelle' }, img: 'koleksiyonlar/pestemal/ca04c60c-7400-46bb-9fad-15a089f6f37f.JPG' },
        { id: 'ps2', n: { tr: 'Riviera Çizgili Klasik Peştemal', en: 'Riviera Striped Classic Fouta', fr: 'Fouta Rayée Classique Riviera' }, img: 'koleksiyonlar/pestemal/6b0fdef9-8fc4-4d0c-85d6-a0377c1ecca6.JPG' },
        { id: 'ps3', n: { tr: 'Okyanus Mavisi Jakarlı Peştemal', en: 'Ocean Blue Jacquard Fouta', fr: 'Fouta Jacquard Bleu Océan' }, img: 'koleksiyonlar/pestemal/1e7ec679-44b3-4c7c-9bc7-71bac847b151.JPG' },
        { id: 'ps4', n: { tr: 'Güneş Sarısı Nakış Numune Peştemal', en: 'Sunshine Yellow Fouta Sample', fr: 'Fouta Jaune Soleil Spéciale Broderie' }, img: 'koleksiyonlar/pestemal/5e9943c8-1c4b-4a8d-bf99-1539df57dee6.JPG' }
      ]
    },
    {
      id: 'canta',
      img: 'koleksiyonlar/canta/Wine_bag_with_botanical_print_202609031318.jpeg',
      ratio: 4/3,
      tr: 'Kanvas Çanta & Şarap Kılıfı',
      en: 'Canvas Bags & Wine Sleeves',
      fr: 'Sacs en Toile & Étuis à Vin',
      d: {
        tr: 'Ağır gramajlı ham pamuk kanvas şarap taşıma çantaları ve büzgülü şişe kılıfları. Riviera bağları ve sahil armalarıyla eko-baskılı.',
        en: 'Heavyweight raw cotton canvas wine bags and drawstring bottle sleeves. Eco-printed with Riviera vineyard and coastal insignias.',
        fr: 'Sacs à vin et pochettes bouteille à cordon en grosse toile de coton écru. Impression écologique de vignobles et blasons côtiers.'
      },
      models: [
        { id: 'c1', n: { tr: 'Kulplu Kanvas Şarap Çantası (Marseille)', en: 'Canvas Wine Tote Bag (Marseille)', fr: 'Sac Porte-Bouteille en Toile (Marseille)' }, img: 'koleksiyonlar/canta/Canvas_wine_bag_mockup_202609031318.jpeg' },
        { id: 'c2', n: { tr: 'Büzgülü Kanvas Şişe Kılıfı (Monaco)', en: 'Drawstring Canvas Bottle Sleeve (Monaco)', fr: 'Étui Bouteille à Cordon (Monaco)' }, img: 'koleksiyonlar/canta/Wine_bag_with_botanical_print_202609031318.jpeg' }
      ]
    },
    {
      id: 'hediyelik',
      img: 'items/designs/chats.jpg',
      ratio: 4/3,
      tr: 'Butik Hediyelik & Özel Nakış',
      en: 'Boutique Gifts & Insignias',
      fr: 'Cadeaux & Broderies Fines',
      d: {
        tr: 'Lüks butik oteller ve konsept mağazalar için özel kedi ve köpek ırkı nakışlı misafir havluları, seyahat keseleri ve kişiselleştirilmiş armalar.',
        en: 'Embroidered guest towels, travel pouches and custom emblems featuring fine animal breeds for luxury concept stores and boutique hotels.',
        fr: 'Serviettes d’invités et trousses brodées de races canines et félines de prestige pour boutiques de luxe et hôtels de charme.'
      },
      models: [
        { id: 'g1', n: { tr: 'Safkan Kedi Nakışlı Misafir Havlusu (4 Irk)', en: 'Pedigree Cat Embroidered Guest Towel', fr: 'Serviette d’Invité Chats de Race (4 Motifs)' }, img: 'items/designs/chats.jpg' },
        { id: 'g2', n: { tr: 'Safkan Köpek Nakışlı Misafir Havlusu (5 Irk)', en: 'Pedigree Dog Embroidered Guest Towel', fr: 'Serviette d’Invité Chiens de Race (5 Motifs)' }, img: 'items/designs/chiens.jpg' },
        { id: 'g3', n: { tr: 'COQ D’OR Fermuarlı Kanvas Seyahat Kesesi', en: 'COQ D’OR Canvas Zipper Travel Pouch', fr: 'Trousse de Voyage Zippée COQ D’OR' }, img: 'items-new/giris-foto.jpeg' }
      ]
    }
  ];

  /* 2. BÖLGESEL DESENLER ARŞİVİ (25 FRANSIZ SAHİL ŞEHRİ) */
  const DESIGNS = [
    {
      id: 'monaco',
      img: 'items/designs/monaco.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Monaco', d: 'Casino de Monte-Carlo’nun Beaux-Arts cephesi, kubbeli kuleleri, fıskiyesi ve palmiyeleri. Altın sarısı saten nakış işlemesi.', t: 'Mimari Nakış' },
      en: { n: 'Monaco', d: 'The Beaux-Arts facade of the Casino de Monte-Carlo, domed towers, fountain and palms. Rich gold satin thread embroidery.', t: 'Architectural' },
      fr: { n: 'Monaco', d: 'Façade Beaux-Arts du Casino de Monte-Carlo, coupoles, fontaine et palmiers. Broderie raffinée en fil d’or satiné.', t: 'Architecture' }
    },
    {
      id: 'nice',
      img: 'items/designs/nice.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Nice', d: 'Hasır sepette zeytinler, zeytinyağı şişesi, lavanta buketleri ve Promenade des Anglais sahil şeridi.', t: 'Akdeniz & Doğa' },
      en: { n: 'Nice', d: 'Basket of ripe olives, olive oil cruet, lavender sprigs and the iconic Promenade des Anglais curve.', t: 'Mediterranean' },
      fr: { n: 'Nice', d: 'Panier d’olives, burette d’huile d’olive, brins de lavande et la courbe emblématique de la Promenade des Anglais.', t: 'Méditerranée' }
    },
    {
      id: 'saint-tropez',
      img: 'items/designs/saint-tropez.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Saint-Tropez', d: 'Saint-Tropez’nin dünyaca ünlü sarı-hardal ve kiremit kırmızısı çan kulesi nakışı.', t: 'Tarihi Sembol' },
      en: { n: 'Saint-Tropez', d: 'The world-famous ochre-yellow and terracotta bell tower of Saint-Tropez, finely stitched.', t: 'Historic Emblem' },
      fr: { n: 'Saint-Tropez', d: 'Le célèbre clocher ocre jaune et terre cuite de Saint-Tropez, brodé avec précision.', t: 'Symbole Historique' }
    },
    {
      id: 'antibes',
      img: 'items/designs/antibes.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Antibes', d: 'Château Grimaldi (Picasso Müzesi), surlar, deniz dalgaları ve stilize Picasso yüz çizgisi motifi.', t: 'Sanat & Miras' },
      en: { n: 'Antibes', d: 'Château Grimaldi (Picasso Museum), ramparts, sea waves, and stylized Picasso face outline.', t: 'Art & Heritage' },
      fr: { n: 'Antibes', d: 'Château Grimaldi (Musée Picasso), remparts, vagues et profil stylisé façon Picasso.', t: 'Art & Patrimoine' }
    },
    {
      id: 'cassis',
      img: 'items/designs/cassis.jpg',
      ratio: 1,
      cat: 'provence',
      tr: { n: 'Cassis', d: 'Hasır örgü sepette fiyonklu lavanta demeti, zeytinyağı şişesi ve zeytin dalı işlemesi.', t: 'Botanik Natürmort' },
      en: { n: 'Cassis', d: 'Woven wicker basket with tied lavender bouquet, olive oil bottle, and fresh olive branch.', t: 'Botanical' },
      fr: { n: 'Cassis', d: 'Panier d’osier tressé garni d’un bouquet de lavande noué, flacon d’huile d’olive et rameau.', t: 'Botanique' }
    },
    {
      id: 'eze-village',
      img: 'items/designs/eze-village.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Èze Village', d: 'Sarp kayalık üzerine kurulu ortaçağ taş köyü, çan kulesi ve Akdeniz seyir terası.', t: 'Tarihi Köy' },
      en: { n: 'Èze Village', d: 'Medieval stone village perched atop steep cliffs, bell tower and Mediterranean overlook.', t: 'Medieval Village' },
      fr: { n: 'Èze Village', d: 'Village médiéval perché sur sa falaise abrupte, clocher et belvédère sur la Grande Bleue.', t: 'Village Perché' }
    },
    {
      id: 'provence',
      img: 'items/designs/provence.jpg',
      ratio: 1,
      cat: 'provence',
      tr: { n: 'Provence', d: 'Glanum antik Roma sütunları, zeytin ağaçları ve sonsuz lavanta tarlaları.', t: 'Bölgesel Miras' },
      en: { n: 'Provence', d: 'Ancient Roman columns of Glanum, olive trees and endless fragrant lavender fields.', t: 'Regional Heritage' },
      fr: { n: 'Provence', d: 'Colonnes antiques romaines de Glanum, oliviers et champs de lavande à perte de vue.', t: 'Patrimoine Régional' }
    },
    {
      id: 'normandie',
      img: 'items/designs/normandie.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Normandie', d: 'Mont Saint-Michel manastır kalesi, dalgalar ve ada surlarının görkemli nakışı.', t: 'Tarihi Anıt' },
      en: { n: 'Normandie', d: 'The majestic abbey fortress of Mont Saint-Michel rising above the tidal waters.', t: 'Monument' },
      fr: { n: 'Normandie', d: 'La silhouette majestueuse de l’abbaye du Mont Saint-Michel au-dessus des marées.', t: 'Monument' }
    },
    {
      id: 'bretagne',
      img: 'items/designs/bretagne.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Bretagne', d: 'Balık formuna işlenmiş Breton bayrağı kakım motifi (Ermine) ve denizci deseni.', t: 'Denizci Amblem' },
      en: { n: 'Bretagne', d: 'Breton ermine heraldic motif stylized into a nautical fish silhouette.', t: 'Nautical Emblem' },
      fr: { n: 'Bretagne', d: 'Hermine héraldique bretonne stylisée sous la forme d’un poisson marin.', t: 'Emblème Marin' }
    },
    {
      id: 'baie-de-somme',
      img: 'items/designs/baie-de-somme.jpg',
      ratio: 1,
      cat: 'kuzey',
      tr: { n: 'Baie de Somme', d: 'Kazıklar üzerindeki renkli ahşap sahil kulübeleri ve kumsalda duran sevimli martı.', t: 'Sahil Yaşamı' },
      en: { n: 'Baie de Somme', d: 'Charming colorful beach huts on wooden boardwalk stilts with a resting seagull.', t: 'Coastal Life' },
      fr: { n: 'Baie de Somme', d: 'Cabanes de plage colorées sur pilotis en bois et goéland posé au bord de l’eau.', t: 'Bord de Mer' }
    },
    {
      id: 'ile-d-oleron',
      img: 'items/designs/ile-d-oleron.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Île d’Oléron', d: 'Kırmızı kubbeli beyaz Chassiron deniz feneri, taş kaide ve okyanus suları.', t: 'Deniz Feneri' },
      en: { n: 'Île d’Oléron', d: 'White Chassiron lighthouse with its red lantern room on a round stone jetty.', t: 'Lighthouse' },
      fr: { n: 'Île d’Oléron', d: 'Phare de Chassiron blanc à coupole rouge sur sa jetée de pierre circulaire.', t: 'Phare Maritime' }
    },
    {
      id: 'vendee',
      img: 'items/designs/vendee.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Vendée', d: 'Mavi panjurlu pencere, sardunyalar ve önünde çiçek sepetli nostaljik Fransız bisikleti.', t: 'Kırsal Romantizm' },
      en: { n: 'Vendée', d: 'Blue-shuttered window with red geraniums and a vintage bicycle with a woven flower basket.', t: 'Country Romance' },
      fr: { n: 'Vendée', d: 'Fenêtre aux volets bleus fleuris et vélo vintage au panier d’osier garni de fleurs.', t: 'Campagne Rétro' }
    },
    {
      id: 'corsica',
      img: 'items/designs/corsica.jpg',
      ratio: 1,
      cat: 'adalar',
      tr: { n: 'Corsica', d: 'Korsika’nın resmi arması Mağribi Başı (Testa Mora); siyah ve beyaz saten kabartmalı nakış.', t: 'Geleneksel Amblem' },
      en: { n: 'Corsica', d: 'Corsica’s historic Moor’s Head (Testa Mora) emblem in bold black and white satin stitch.', t: 'Historic Emblem' },
      fr: { n: 'Corse', d: 'Emblème historique de la Corse (Testa Mora) en broderie satin noir et blanc.', t: 'Emblème Historique' }
    },
    {
      id: 'marseille',
      img: 'items/designs/marseille.jpg',
      ratio: 1,
      cat: 'provence',
      tr: { n: 'Marseille', d: 'Provence biberiyesi (romarin) ve mor lavanta dalları botanik nakış kompozisyonu.', t: 'Botanik Nakış' },
      en: { n: 'Marseille', d: 'Fine botanical embroidery of wild rosemary sprig and vibrant violet lavender.', t: 'Botanical' },
      fr: { n: 'Marseille', d: 'Broderie botanique raffinée de romarin sauvage et brins de lavande pourpre.', t: 'Botanique' }
    },
    {
      id: 'fort-boyard',
      img: 'items/designs/fort-boyard.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Fort Boyard', d: 'Atlantik Okyanusu’nun ortasında yükselen tarihi oval taş kale ve deniz dalgaları.', t: 'Tarihi Kale' },
      en: { n: 'Fort Boyard', d: 'The legendary oval stone sea fortress rising proudly from the Atlantic waves.', t: 'Sea Fortress' },
      fr: { n: 'Fort Boyard', d: 'Le légendaire fort boyard ovale en pierre de taille émergeant des flots atlantiques.', t: 'Fort Maritime' }
    },
    {
      id: 'cote-d-opale',
      img: 'items/designs/cote-d-opale.jpg',
      ratio: 1,
      cat: 'kuzey',
      tr: { n: 'Côte d’Opale', d: 'Beyaz tebeşir falezleri (Cap Blanc-Nez), rüzgar sörfçüsü ve köpüklü okyanus dalgaları.', t: 'Spor & Sahil' },
      en: { n: 'Côte d’Opale', d: 'White chalk cliffs of Cap Blanc-Nez, a windsurfer skimming across white-capped waves.', t: 'Watersports' },
      fr: { n: 'Côte d’Opale', d: 'Falaises blanches du Cap Blanc-Nez, véliplanchiste fendant les vagues écumantes.', t: 'Bord de Mer' }
    },
    {
      id: 'frejus',
      img: 'items/designs/frejus.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Fréjus', d: 'Antik Roma su kemeri, tarihi katedral kulesi ve Akdeniz kıyısı nakışı.', t: 'Antik Roma Mirası' },
      en: { n: 'Fréjus', d: 'Ancient Roman aqueduct arch, historic cathedral tower and Mediterranean coastal landscape.', t: 'Roman Heritage' },
      fr: { n: 'Fréjus', d: 'Aqueduc romain antique, tour de cathédrale historique et rivage méditerranéen.', t: 'Patrimoine Antique' }
    },
    {
      id: 'la-rochelle',
      img: 'items/designs/la-rochelle.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'La Rochelle', d: 'Eski limanın koruyucusu tarihi ikiz taş kuleler (Tour Saint-Nicolas ve Tour de la Chaîne).', t: 'Tarihi Liman' },
      en: { n: 'La Rochelle', d: 'The iconic medieval twin stone harbor defense towers guarding the Old Port.', t: 'Medieval Port' },
      fr: { n: 'La Rochelle', d: 'Les emblématiques tours jumelles médiévales gardant l’entrée du Vieux-Port.', t: 'Port Historique' }
    },
    {
      id: 'les-landes',
      img: 'items/designs/les-landes.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Les Landes', d: 'Dev çam ormanları kozalağı, çam iğneleri ve sevimli sincap nakışı.', t: 'Orman & Doğa' },
      en: { n: 'Les Landes', d: 'Pine cone from the vast Landes maritime forests, needles and a sweet red squirrel.', t: 'Forest & Wildlife' },
      fr: { n: 'Les Landes', d: 'Pomme de pin de la forêt maritime landaise, aiguilles et écureuil roux espiègle.', t: 'Faune & Forêt' }
    },
    {
      id: 'mimizan',
      img: 'items/designs/mimizan.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Mimizan', d: 'Okyanus sahili, çizgili şezlong, plaj şemsiyesi, sörf tahtası ve kum tepeleri.', t: 'Sörf & Plaj' },
      en: { n: 'Mimizan', d: 'Atlantic ocean beach, striped deckchair, parasol, surfboard and rolling sand dunes.', t: 'Surf & Beach' },
      fr: { n: 'Mimizan', d: 'Plage atlantique, transat rayé, parasol, planche de surf et dunes sablonneuses.', t: 'Surf & Océan' }
    },
    {
      id: 'montpellier',
      img: 'items/designs/montpellier.jpg',
      ratio: 1,
      cat: 'guney',
      tr: { n: 'Montpellier', d: 'Porte du Peyrou Zafer Takı; 14. Louis dönemi altın armaları ve taş kabartmaları.', t: 'Zafer Takı' },
      en: { n: 'Montpellier', d: 'Porte du Peyrou triumphal arch with Louis XIV royal insignias and stone reliefs.', t: 'Triumphal Arch' },
      fr: { n: 'Montpellier', d: 'Arc de Triomphe de la Porte du Peyrou, médaillons royaux et bas-reliefs dorés.', t: 'Monuments' }
    },
    {
      id: 'pays-basque',
      img: 'items/designs/pays-basque.jpg',
      ratio: 1,
      cat: 'guney',
      tr: { n: 'Pays Basque', d: 'Kırmızı ve yeşil renklerde geleneksel Bask Haçı (Lauburu) arması.', t: 'Kültürel Amblem' },
      en: { n: 'Pays Basque', d: 'Traditional Basque cross (Lauburu) emblem in regional red and emerald green.', t: 'Cultural Emblem' },
      fr: { n: 'Pays Basque', d: 'Croix basque traditionnelle (Lauburu) en rouge et vert basques caractéristiques.', t: 'Emblème Culturel' }
    },
    {
      id: 'toulon',
      img: 'items/designs/toulon.jpg',
      ratio: 1,
      cat: 'riviera',
      tr: { n: 'Toulon', d: 'Toulon Fransız donanma üssü simgesi uçak gemisi ve Akdeniz suları nakışı.', t: 'Denizcilik' },
      en: { n: 'Toulon', d: 'French naval fleet flagship carrier cruising the deep Mediterranean waters of Toulon.', t: 'Maritime Fleet' },
      fr: { n: 'Toulon', d: 'Porte-avions de la Marine Nationale fendant les flots de la rade de Toulon.', t: 'Marine Nationale' }
    },
    {
      id: 'aups',
      img: 'items/designs/aups.jpg',
      ratio: 1,
      cat: 'provence',
      tr: { n: 'Aups', d: 'Yarım çelenk şeklinde zeytin dalları ve ortasında taze lavanta buketi arması.', t: 'Zeytin Çelengi' },
      en: { n: 'Aups', d: 'Laurel wreath of olive branches with ripe olives framing a bouquet of fresh lavender.', t: 'Olive Wreath' },
      fr: { n: 'Aups', d: 'Couronne de rameaux d’olivier aux fruits mûrs entourant un bouquet de lavande.', t: 'Couronne Végétale' }
    },
    {
      id: 'charente-maritime',
      img: 'items/designs/charente-maritime.jpg',
      ratio: 1,
      cat: 'atlantik',
      tr: { n: 'Charente-Maritime', d: 'Geleneksel beyaz taş ev, mavi ahşap kapılar, sarmaşık asma ve nostaljik bisiklet.', t: 'Sahil Köyü' },
      en: { n: 'Charente-Maritime', d: 'Traditional white stone cottage, pastel blue door, climbing vine and vintage bike.', t: 'Coastal Village' },
      fr: { n: 'Charente-Maritime', d: 'Maisonnette blanche en pierre de taille, porte bleu pastel, vigne et bicyclette.', t: 'Village Côtier' }
    }
  ];

  /* 3. ÇOK DİLLİ SÖZLÜK (I18N) */
  const I18N = {
    tr: {
      skip: 'İçeriğe atla',
      'nav.collections': 'Ürün Grupları',
      'nav.catalog': 'E-Katalog',
      'nav.designs': 'Desen Arşivi',
      'nav.atelier': 'Atölye & Üretim',
      'nav.contact': 'İletişim & Teklif',
      'nav.quote': 'Teklif Al',

      'hero.title1': 'Otel, butik & hediyelik tekstilde',
      'hero.title2': 'toptan üretim.',
      'hero.lede': 'Otel, butik ve konsept mağazalar için %100 Ege pamuğundan bornoz, havlu, pike, peştemal, çanta ve hediyelik koleksiyonları. Hassas nakış ve yüksek çözünürlüklü baskı üretimi.',
      'hero.cta1': 'E-Kataloğu İncele',
      'hero.cta2': 'Numune & Fiyat Teklifi',
      'hero.note': 'B2B · Min. sipariş: 100 adet / model · Tüm Avrupa’ya teslimat',
      'hero.caption': 'COQ D’OR MAISON DE LINGE, Koleksiyon Vitrini - %100 Ege pamuğu',

      'collections.eyebrow': 'ÜRÜN GRUPLARIMIZ',
      'collections.title': 'Bir ürün, bir dokunuş, bir zarafet.',
      'collections.lede': 'Bornozdan havluya, pikeden şarap çantasına; her ürün grubu en kaliteli %100 Ege pamuğu iplikleriyle üretilir.',

      'catalog.eyebrow': 'DESEN ARŞİVİ',
      'catalog.title': 'Bir bölge, bir hikâye, bir dizi desen.',
      'catalog.lede': 'Her desen; bornoz, havlu, pike, peştemal veya kanvas çanta üzerine nakış veya eko-baskı olarak uygulanabilir.',
      'catalog.empty': 'Bu filtreye uyan desen bulunamadı.',
      'catalog.more': 'Daha Fazla Desen Göster',
      'catalog.all': 'Tüm Desenler',
      'catalog.reset': 'Filtreyi Temizle',
      'catalog.count': 'desen listeleniyor',

      'modal.inQuote': 'Teklife Eklendi',
      'modal.remove': 'Tekliften Çıkar',
      'modal.addQuote': 'Teklife Ekle',
      'modal.pdf': 'E-Kataloğu Aç',
      'modal.specs': 'Materyal & Üretim',
      'modal.specsV': '%100 Ege Pamuğu · Nakış (38.000 dikiş) veya Eko-Baskı',
      'modal.unit': 'model / seçenek',
      'modal.chooseProduct': 'Bu Deseni Hangi Üründe İstersiniz?',

      'atelier.eyebrow': 'ATÖLYE & ÜRETİM',
      'atelier.title': 'Dokunuşu hissettiren kalite.',
      'atelier.lede': '%100 saf Ege pamuğu bukle havlular, nefes alan müslinler ve balpeteği pikeler. Hassas endüstriyel nakış ve yüksek çözünürlüklü su bazlı eko-baskı teknolojisi.',
      'atelier.f1': '%100 Ege Pamuğu',
      'atelier.f1d': '450-550 g/m² havlu · 300 g/m² pike',
      'atelier.f2': 'Nakış & Baskı',
      'atelier.f2d': '38.000 dikiş / desen & su bazlı eko-baskı',
      'atelier.f3': 'Özel Üretim',
      'atelier.f3d': 'Otel veya butiğinize özel logo/arma',
      'atelier.link': 'Özel üretim şartları için bize yazın →',

      'contact.eyebrow': 'TEKLİF & İLETİŞİM',
      'contact.title': 'Toptan Teklif Alın.',
      'contact.lede': 'Ürün veya desenleri seçin, formu doldurun; toptan fiyat listesi ve numune programı iki iş günü içinde yanınızda.',
      'contact.addr': '12, Avenue de la Californie, 06200 Nice, Fransa',

      'form.selected': 'Teklife Eklenen Ürünler & Desenler',
      'form.noSelection': 'Henüz seçim yapılmadı. Aşağıdaki katalogdan ürün ekleyebilirsiniz.',
      'form.name': 'Ad Soyad *',
      'form.company': 'Firma / Otel / Butik',
      'form.email': 'E-posta *',
      'form.phone': 'Telefon',
      'form.message': 'Sipariş Notu / İhtiyaçlar',
      'form.messagePh': 'Tahmini adetler, teslimat tarihi, ürün grupları...',
      'form.error': 'Lütfen zorunlu alanları doldurun: ad ve geçerli bir e-posta.',
      'form.errName': 'Lütfen adınızı yazın.',
      'form.errEmail': 'Lütfen geçerli bir e-posta adresi yazın.',
      'form.submit': 'Teklif Talebini Gönder',
      'form.sending': 'Gönderiliyor…',
      'form.success': 'Talebiniz başarıyla alındı. 2 iş günü içinde toptan fiyat listemizle dönüş yapacağız.',

      'footer.note': 'Nice, Fransa · toptan turistik ve otel tekstili üreticisi',

      'ecat.eyebrow': 'E-KATALOG · 2026',
      'ecat.title': 'Ürün Grupları ve Desenler.',
      'ecat.lede': '6 temel ürün grubu, 25 bölgesel sahil deseni. %100 Ege pamuğu lüks bornoz, havlu, pike, peştemal, çanta ve hediyelik koleksiyonları.',
      'ecat.note': '%100 Ege Pamuğu · Nakış ve Baskı Üretimi · Minimum 100 Adet Toptan Sipariş',
      'ecat.designs': 'desen / model',
      'ecat.coll': 'Kategori',
      'ecat.viewDesigns': 'Modelleri Gör →',
      'ecat.quoteDesign': 'Fiyat Teklifi İste',
      'ecat.cta': 'Bu koleksiyonlardan numune veya toptan fiyat teklifi almak ister misiniz?',
      'ecat.ctaBtn': 'Hemen Teklif Alın'
    },

    en: {
      skip: 'Skip to content',
      'nav.collections': 'Product Groups',
      'nav.catalog': 'E-Catalog',
      'nav.designs': 'Design Archive',
      'nav.atelier': 'Atelier & Craft',
      'nav.contact': 'Contact & Quote',
      'nav.quote': 'Get a Quote',

      'hero.title1': 'For hotels, boutiques & gift stores,',
      'hero.title2': 'wholesale textile craft.',
      'hero.lede': 'Bathrobes, towels, piqués, foutas, bags and keepsakes in 100% Aegean cotton, for hotels, boutiques and concept stores. Fine embroidery and high-definition print production.',
      'hero.cta1': 'Explore E-Catalog',
      'hero.cta2': 'Samples & Pricing',
      'hero.note': 'B2B · Min. order: 100 pcs / style · Delivery across Europe',
      'hero.caption': 'COQ D’OR MAISON DE LINGE, Collection Showcase - 100% Aegean Cotton',

      'collections.eyebrow': 'OUR PRODUCT RANGES',
      'collections.title': 'One product, one touch, one elegance.',
      'collections.lede': 'From plush bathrobes to waffle blankets and canvas wine totes; every piece is woven from premium 100% Aegean long-staple cotton.',

      'catalog.eyebrow': 'DESIGN ARCHIVE',
      'catalog.title': 'One region, one story, a series of designs.',
      'catalog.lede': 'Every regional crest can be customized onto bathrobes, towels, piqués, foutas or canvas bags via satin embroidery or high-definition print.',
      'catalog.empty': 'No designs found for this filter.',
      'catalog.more': 'Show More Designs',
      'catalog.all': 'All Designs',
      'catalog.reset': 'Clear Filter',
      'catalog.count': 'designs shown',

      'modal.inQuote': 'Added to Quote',
      'modal.remove': 'Remove from Quote',
      'modal.addQuote': 'Add to Quote',
      'modal.pdf': 'Open E-Catalog',
      'modal.specs': 'Materials & Craft',
      'modal.specsV': '100% Aegean Cotton · 38,000 stitches embroidery or eco-print',
      'modal.unit': 'models / styles',
      'modal.chooseProduct': 'Apply This Design On Which Product?',

      'atelier.eyebrow': 'ATELIER & PRODUCTION',
      'atelier.title': 'Quality you can truly feel.',
      'atelier.lede': '100% pure Aegean cotton terry towels, airy muslins and honeycomb piqués. Industrial embroidery and high-definition water-based printing.',
      'atelier.f1': '100% Aegean Cotton',
      'atelier.f1d': '450-550 g/m² towels · 300 g/m² piqués',
      'atelier.f2': 'Embroidery & Print',
      'atelier.f2d': '38,000 stitches per design & eco-printing',
      'atelier.f3': 'Custom Insignia',
      'atelier.f3d': 'Custom crests tailored for your hotel/brand',
      'atelier.link': 'Contact us for bespoke hotel branding →',

      'contact.eyebrow': 'QUOTE & INQUIRIES',
      'contact.title': 'Request Wholesale Pricing.',
      'contact.lede': 'Select categories or designs, complete the form; our wholesale catalog and sample program will reach you within two business days.',
      'contact.addr': '12, Avenue de la Californie, 06200 Nice, France',

      'form.selected': 'Selected Products & Designs',
      'form.noSelection': 'No items selected yet. Choose designs or categories below.',
      'form.name': 'Full Name *',
      'form.company': 'Company / Hotel / Boutique',
      'form.email': 'Email Address *',
      'form.phone': 'Phone Number',
      'form.message': 'Inquiry Details / Volumes',
      'form.messagePh': 'Estimated quantities, delivery timeline, product styles...',
      'form.error': 'Please fill all required fields: name and a valid email.',
      'form.errName': 'Please enter your name.',
      'form.errEmail': 'Please enter a valid email address.',
      'form.submit': 'Send Wholesale Request',
      'form.sending': 'Sending…',
      'form.success': 'Your request has been received. Our team will contact you within 2 business days.',

      'footer.note': 'Nice, France · B2B manufacturer of hospitality and boutique resort textiles',

      'ecat.eyebrow': 'E-CATALOG · 2026',
      'ecat.title': 'Collections & Regional Designs.',
      'ecat.lede': '6 core product categories, 25 French coastal designs. 100% Aegean cotton bathrobes, towels, piqués, foutas and canvas totes.',
      'ecat.note': '100% Aegean Cotton · Fine Embroidery & Eco-Printing · Minimum Order 100 Units',
      'ecat.designs': 'designs / models',
      'ecat.coll': 'Category',
      'ecat.viewDesigns': 'View Models →',
      'ecat.quoteDesign': 'Request Pricing',
      'ecat.cta': 'Would you like to order samples or receive our wholesale price list?',
      'ecat.ctaBtn': 'Request a Quote'
    },

    fr: {
      skip: 'Aller au contenu',
      'nav.collections': 'Gammes Produits',
      'nav.catalog': 'E-Catalogue',
      'nav.designs': 'Broderies & Villes',
      'nav.atelier': 'Atelier & Confection',
      'nav.contact': 'Contact & Devis',
      'nav.quote': 'Demander un Devis',

      'hero.title1': 'Pour hôtels, boutiques & boutiques de souvenirs,',
      'hero.title2': 'le textile en gros.',
      'hero.lede': 'Peignoirs, serviettes, piqués, foutas, sacs et cadeaux en 100% coton égéen, pour hôtels, boutiques et concept-stores. Broderie fine et impression haute définition.',
      'hero.cta1': 'Consulter l’E-Catalogue',
      'hero.cta2': 'Échantillons & Tarifs',
      'hero.note': 'B2B · Min. : 100 pièces / modèle · Livraison dans toute l’Europe',
      'hero.caption': 'COQ D’OR MAISON DE LINGE, Vitrine de Collection - 100% coton égéen',

      'collections.eyebrow': 'NOS GAMMES PRODUITS',
      'collections.title': 'Un produit, un toucher, une élégance.',
      'collections.lede': 'Du peignoir col châle au piqué gaufré et au sac à vin en toile ; chaque pièce est confectionnée dans le meilleur coton égéen à longues fibres.',

      'catalog.eyebrow': 'ARCHIVE DES DESSINS',
      'catalog.title': 'Une région, une histoire, une série de motifs.',
      'catalog.lede': 'Chaque motif régional peut être personnalisé sur peignoirs, serviettes, piqués, foutas ou sacs en toile via broderie satin ou impression haute définition.',
      'catalog.empty': 'Aucun motif ne correspond à ce filtre.',
      'catalog.more': 'Voir Plus de Motifs',
      'catalog.all': 'Tous les Motifs',
      'catalog.reset': 'Effacer le Filtre',
      'catalog.count': 'motifs affichés',

      'modal.inQuote': 'Ajouté au Devis',
      'modal.remove': 'Retirer du Devis',
      'modal.addQuote': 'Ajouter au Devis',
      'modal.pdf': 'Ouvrir l’E-Catalogue',
      'modal.specs': 'Matière & Savoir-faire',
      'modal.specsV': '100% Coton Égéen · 38 000 points broderie ou impression éco',
      'modal.unit': 'modèles / options',
      'modal.chooseProduct': 'Sur Quel Produit Souhaitez-vous ce Motif ?',

      'atelier.eyebrow': 'ATELIER & SAVOIR-FAIRE',
      'atelier.title': 'Une matière qui se ressent.',
      'atelier.lede': 'Éponge 100% pur coton égéen, mousselines aérées et piqués nid d’abeille. Broderie industrielle haute précision et impression écologique à l’eau.',
      'atelier.f1': '100% Coton Égéen',
      'atelier.f1d': 'Serviettes 450-550 g/m² · Piqués 300 g/m²',
      'atelier.f2': 'Broderie & Impression',
      'atelier.f2d': '38 000 points par motif & impression éco',
      'atelier.f3': 'Personnalisation',
      'atelier.f3d': 'Blasons et logos sur mesure pour votre établissement',
      'atelier.link': 'Contactez-nous pour vos projets sur mesure →',

      'contact.eyebrow': 'DEVIS & CONTACT',
      'contact.title': 'Demandez Vos Tarifs Grossiste.',
      'contact.lede': 'Sélectionnez vos modèles ou motifs, remplissez le formulaire ; notre grille tarifaire B2B et le programme d’échantillons vous parviendront sous 48h.',
      'contact.addr': '12, Avenue de la Californie, 06200 Nice, France',

      'form.selected': 'Produits & Motifs Sélectionnés',
      'form.noSelection': 'Aucun produit sélectionné pour l’instant. Choisissez vos modèles ci-dessous.',
      'form.name': 'Nom et Prénom *',
      'form.company': 'Société / Hôtel / Boutique',
      'form.email': 'Adresse E-mail *',
      'form.phone': 'Numéro de Téléphone',
      'form.message': 'Détails de Votre Projet / Volumes',
      'form.messagePh': 'Quantités estimées, date de livraison souhaitée, finitions...',
      'form.error': 'Veuillez remplir les champs obligatoires : nom et e-mail valide.',
      'form.errName': 'Veuillez renseigner votre nom.',
      'form.errEmail': 'Veuillez renseigner une adresse e-mail valide.',
      'form.submit': 'Envoyer la Demande de Devis',
      'form.sending': 'Envoi en cours…',
      'form.success': 'Votre demande a bien été reçue. Notre service commercial vous répondra sous 2 jours ouvrés.',

      'footer.note': 'Nice, France · Confectionneur grossiste de linge pour l’hôtellerie et les boutiques de charme',

      'ecat.eyebrow': 'E-CATALOGUE · 2026',
      'ecat.title': 'Gammes de Produits et Motifs Côtiers.',
      'ecat.lede': '6 familles de produits essentielles, 25 motifs régionaux. Peignoirs, serviettes, piqués, foutas et sacs en 100% coton égéen de qualité hôtelière.',
      'ecat.note': '100% Coton Égéen · Broderie Satin & Impression Éco · Commande Minimale : 100 Pièces',
      'ecat.designs': 'motifs / modèles',
      'ecat.coll': 'Catégorie',
      'ecat.viewDesigns': 'Découvrir les Modèles →',
      'ecat.quoteDesign': 'Demander un Devis',
      'ecat.cta': 'Souhaitez-vous recevoir un échantillon ou notre grille tarifaire grossiste ?',
      'ecat.ctaBtn': 'Demander un Devis'
    }
  };

  /* Geriye dönük uyumluluk için COLLECTIONS ve PRODUCTS takma adları */
  global.DAMIRA = {
    CATEGORIES,
    COLLECTIONS: CATEGORIES,
    DESIGNS,
    PRODUCTS: DESIGNS,
    I18N
  };
})(window);
