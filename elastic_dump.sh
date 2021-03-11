

#for more options like check elasticdump github page
indices=$(curl -X GET "localhost:9200/_cat/indices/table*?h=index")
for index in $indices 
do
  echo index $index
  elasticdump  --input=http://localhost:9200/$index  --output=http://localhost:9201/$index  --type=settings \
  &&elasticdump  --input=http://localhost:9200/$index --output=http://localhost:9201/$index --type=mapping \
  &&elasticdump  --input=http://localhost:9200/$index --output=http://localhost:9201/$index --type=data --bulk=true --limit=5000
done


#elasticdump  --input=http://localhost:9200/ --output=http://localhost:9201/table2  --type=analyzer && elasticdump  --input=http://localhost:9200/ --output=http://localhost:9201/table2 --type=mapping && elasticdump  --input=http://localhost:9200/table-data* --output=http://localhost:9201/ --type=data --limit=1000

#multielasticdump --input=http://localhost:9200 --output=http://localhost:9201 --match='table-data*'  --includeType='setting,analyzer,mapping,data'


