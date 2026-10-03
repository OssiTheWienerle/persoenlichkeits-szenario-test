# Test – Persönlichkeit in Situationen

Deutschsprachiger, explorativer Szenario-Selbsttest für Erwachsene. Version 2 enthält 14 vollständig neu geschriebene Alltagssituationen mit konkreten Personen, Beziehungen und Umständen sowie das erweiterte Knopf-Gedankenspiel. Es gibt 45 Skalenfragen, Handlungs- und Motivwahlen, freiwillige Kontextangaben und ein transparentes Antwortprofil. Die geschätzte Bearbeitungszeit liegt bei 25–40 Minuten; sie wurde nicht durch eine Nutzungsstudie bestätigt.

## Knopf-Gedankenspiel

Jeder Druck tötet einen zufällig ausgewählten lebenden Menschen weltweit. Auch Angehörige, Freunde und die antwortende Person können betroffen sein. Bei einem eigenen Tod endet der Durchlauf. Der Betrag gilt pro Druck, nicht für den ganzen Durchlauf.

Der Mindestbetrag ist in abgestuften Optionen von 10 Euro bis 10 Millionen Euro wählbar. Die beabsichtigte Zahl der Drucke kann 0, 1, 2, 5, 10, 50, 100, 1.000, 50.000, 100.000 oder 1.000.000+ betragen. „Gar nicht“ benötigt keine Betragswahl. 1.000.000+ bezeichnet eine offene Kategorie, keine genaue Zahl. Betragsgrenze und Druckzahl erscheinen als Antwortbelege; sie verändern keine Merkmalsformel.

## Starten

Lokale Entwicklung: `./Starten.sh` oder `npm run dev -- --host 127.0.0.1 --port 4317`.

Render/Node-Produktion:

```
npm ci --include=dev
npm test
npm run build:render
PORT=4318 npm run start:render
```

Der Produktionsserver bindet an `0.0.0.0` und übernimmt den von Render gesetzten `PORT`. Node.js ab 22.13 wird benötigt. Auf Render ist `npm run start:render` der Startbefehl; der kostenlose Tarif ist vorgesehen. Die bestehende Cloudflare-Konfiguration bleibt für lokale Entwicklung und eine mögliche separate Cloudflare-Bereitstellung erhalten.

## Antworten und Auswertung

Antworten werden im Arbeitsspeicher des Browsers gehalten und nicht automatisch gespeichert. Speichern und Laden erfolgen über ausdrücklich gewählte lokale JSON-Dateien. Ein Neuladen verliert ungesicherte Antworten. JSON-Dateien enthalten persönliche Angaben. Ein Ergebnis kann heruntergeladen oder über Drucken als PDF ausgegeben werden.

Gespeicherte Durchläufe aus Version 1 sind mit den neuen Szenarien nicht kompatibel und werden abgelehnt, damit frühere Antworten nicht neuen Situationen zugeordnet werden.

Jeder der neun Merkmalsbereiche enthält fünf Skalenfragen. Der Wert ist der ungewichtete Mittelwert tatsächlich gegebener Zahlen, auf eine Dezimalstelle gerundet. Ausgelassene Skalen und übersprungene Situationen zählen nicht. Unter drei Antworten wird kein Bereichswert angezeigt. Spannweiten sind keine Ehrlichkeits- oder Reliabilitätswerte. Handlungen, Motive, Knopfdruckzahl und Mindestbetrag werden nicht zu Diagnosen oder klinischen Schweregraden verrechnet.

Der Test ist **wissenschaftlich nicht validiert**. Er stellt keine Diagnose und gibt keine Erkrankungswahrscheinlichkeiten oder Normwerte an. Die Einordnung beschreibt hypothetische Selbstauskünfte und kann tatsächliches Verhalten nicht sicher vorhersagen.

## KI-Berichte

Die sichtbare Einordnung entsteht aus festen Regeln. Der KI-Bericht bleibt ohne tatsächlich konfigurierten Anbieter deaktiviert. Ein Render-API-Schlüssel ist ausschließlich ein Hosting-Zugang und kein KI-Anbieterzugang. Deployment-Zugangsdaten gehören weder in diesen Quellstand noch in Browservariablen.

Der vorbereitete Gateway-Vertrag und System-Prompt befinden sich in `lib/report.ts`: ein serverseitiger POST mit `system_prompt` und `input` erhält `{ "report": "…" }` zurück. Vor einer Übertragung ist die ausdrückliche Freigabe im Browser erforderlich. Anbieterinformationen, URL und Secret sowie eine dauerhafte Quotendatenbank müssen eingerichtet und geprüft sein, bevor die Berichtsfunktion aktiviert wird.

Die Cloudflare-Variante unterstützt die D1-Bindung `DB`. Die Render-Variante liefert derzeit nur Server-Umgebungsvariablen und keine Quotendatenbank; deshalb bleibt die Berichtsfunktion dort auch bei versehentlich gesetztem Anbieter-Schlüssel gesperrt. Das Bereitstellen einer geeigneten dauerhaften Quotendatenbank gehört zur späteren KI-Anbindung. Es werden keine Antworten oder Berichtstexte protokolliert oder serverseitig gespeichert.

## Prüfungen

`npm test` prüft die Auswertung, Versionen, fehlende Angaben, Knopfoptionen und Betragsgrenzen sowie die Schutzbedingungen des Bericht-Endpunkts. `npx tsc --noEmit` prüft die Typen. Tests verwenden synthetische Angaben und keinen echten KI-Dienst.

Grundlagen zur Grenze klinischer Einordnung: [NICE](https://www.nice.org.uk/guidance/cg77/chapter/Recommendations). Diese Quelle validiert die selbst entwickelten Szenarien nicht.
