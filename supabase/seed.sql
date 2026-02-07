-- Seed data for testing
-- This file contains sample data to help test the application

-- Insert sample projects
INSERT INTO public.projects (name, instagram_link, fabrics, money_spent, fabric_used, time_spent, comments, project_date, status, pattern_brand, purchased_from)
VALUES
    (
        'Blumen-Sommerkleid',
        'https://instagram.com/p/example1',
        ARRAY['Baumwolle Blumendruck', 'Baumwollfutter'],
        45.50,
        2.5,
        8.0,
        'Mein erstes Kleid! Der Reißverschluss war knifflig, aber ich habe viel über Mustermontage gelernt.',
        '2025-11-02',
        'Fertig',
        'Burda',
        'Stoff & Stil'
    ),
    (
        'Denim Tote Bag',
        NULL,
        ARRAY['Recycelte Jeans', 'Canvas-Futter'],
        12.00,
        0.5,
        3.5,
        'Upcycling aus alten Jeans. Tolles Anfängerprojekt!',
        '2026-01-25',
        'Fertig',
        NULL,
        NULL
    ),
    (
        'Quilted Throw Blanket',
        'https://instagram.com/p/example2',
        ARRAY['Baumwoll-Quiltquadrate', 'Vlies', 'Flanell-Rückseite'],
        87.25,
        4.0,
        25.5,
        'Mein bisher ehrgeizigstes Projekt. Die gesamte Decke von Hand gequiltet. Sehr stolz auf das Ergebnis!',
        '2024-12-02',
        'Fertig',
        NULL,
        'Patchwork-Laden München'
    ),
    (
        'Basic T-Shirt für Markus',
        NULL,
        ARRAY['Jersey'],
        18.00,
        1.2,
        2.0,
        'Einfaches Projekt zum Üben mit Strickwaren und meiner Overlock.',
        '2026-02-03',
        'Fertig',
        'Ottobre',
        'Stoffe Hemmers'
    ),
    (
        'Leinen-Schürze',
        'https://instagram.com/p/example3',
        ARRAY['Leinen natur', 'Baumwollband'],
        28.50,
        1.0,
        4.5,
        'Als Geschenk für eine Freundin gemacht. Das Leinen war wunderbar zu verarbeiten.',
        '2025-07-01',
        'Fertig',
        'Simplicity',
        'Stoff & Stil'
    ),
    (
        'Federmappe für Mia',
        NULL,
        ARRAY['Baumwolle bedruckt', 'Reißverschluss'],
        8.50,
        0.3,
        1.5,
        'Kleine Federmappe für meine Nichte. Perfekt für Stoffreste!',
        '2025-09-15',
        'Fertig',
        NULL,
        'Stoffmarkt'
    ),
    (
        'Sommerkleid',
        NULL,
        ARRAY['Viskose geblümt', 'Baumwollfutter'],
        38.00,
        2.2,
        6.5,
        'Leichtes Sommerkleid mit Kellerfalten. Die Viskose fällt wunderschön.',
        '2025-06-20',
        'In Bearbeitung',
        'Named',
        'Makerist'
    ),
    (
        'Herbstkleid',
        NULL,
        ARRAY['Wollmischung kariert'],
        52.00,
        2.8,
        0.0,
        'Warmes Kleid für die kalte Jahreszeit. Material und Schnitt schon besorgt.',
        '2025-10-10',
        'Geplant',
        'Schnittmuster Berlin',
        'Stoff & Stil'
    );

-- Note: These are sample projects for testing purposes
-- You can delete them once you start adding real data
