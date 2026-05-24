# CSV Processor

Process supplier CSV files through configurable rules and column mappings.

## What it does

For each supplier:

1. **Column mappings** — map supplier column names to standard fields (`ProductName`, `Quantity`, `Price`, `SKU`)
2. **Rules** transform values: `Multiply`, `Remove`, `Regex` — applied in order on every upload
3. **Upload** a CSV and the rules run, saving each row to `processed_rows`
4. **Physical CSV** is also written to disk if the per-supplier flag is on
5. **Export** applies the column mappings and downloads the CSV

## CSV format expectations

Supports standard CSV per international conventions:

- Comma-delimited
- Period as decimal separator
- No thousand separators
- First row is treated as headers
- UTF-8 encoded

EU-style formats (semicolon delimiter, comma decimal) are out of scope. Proper support would add per-supplier locale via PHP's `NumberFormatter`.

## Brief interpretation notes

Two items in the brief had multiple plausible readings. I chose deliberately:

- **Mapping is applied at export only.** The optional physical CSV (per-supplier flag) contains post-rules data with the supplier's source column names — NOT the canonical export. Export is a separate on-demand operation that translates names and filters unmapped columns.
- **Processed rows in DB as JSON column.** One row per CSV line, JSON-encoded. Keeps the staging immutable and re-exportable with any current mapping.

## Local setup

Requires PHP 8.4+, Node 22+, MySQL 8 (or SQLite — default).

```bash
git clone https://github.com/haraldsuurorg/csv-processor
cd csv-processor
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
composer run dev
```

Defaults to SQLite for zero-config. To switch to MySQL, edit `.env`'s `DB_*` variables and re-run `php artisan migrate:fresh`.
