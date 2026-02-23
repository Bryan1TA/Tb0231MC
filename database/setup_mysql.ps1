param(
  [string]$MysqlPath = 'mysql',
  [string]$User = 'root',
  [string]$Host = 'localhost',
  [int]$Port = 3306
)

$schema = Join-Path $PSScriptRoot 'schema.sql'
if (!(Test-Path $schema)) {
  Write-Error "Arquivo nao encontrado: $schema"
  exit 1
}

Write-Host "Importando schema em web_03mc..."
& $MysqlPath -h $Host -P $Port -u $User -p --execute "source $schema"
if ($LASTEXITCODE -ne 0) {
  Write-Error 'Falha ao importar o schema.'
  exit $LASTEXITCODE
}

Write-Host 'Banco e tabela criados com sucesso.'
