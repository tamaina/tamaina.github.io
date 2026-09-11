# Legacy compatibility fixture

`legacy-content.json` contains only the fields used by compatibility tests: source/public paths, titles, descriptions, heading IDs, draft state, and the captured production sitemap paths.

It is extracted without regenerating expected values from `bcef095a1724c3f60926a38499a1e9bf27e5876a:maintenance/baseline/content.json` and `sitemap.xml`. Those were obtained on 2026-09-11 from the Nuxt Content 2.13.4/MDC 0.9.5 parser at source commit `25c890dc23daa38a279da7f7ec2174a8ede1b556` and the then-live site. Historical screenshots and generated HTML are not required by tests.
