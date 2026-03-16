dev:
	docker compose -p new-control-finance up -d --build

prod:
	docker compose -p new-control-finance-prod -f docker-compose.prod.yml up -d --build