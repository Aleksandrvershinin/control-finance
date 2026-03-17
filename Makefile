dev:
	docker compose -p new-control-finance up -d --build

prod:
	docker compose -p new-control-finance-prod -f docker-compose.prod.yml up -d --build

migrate-prod:
	docker compose -p new-control-finance-prod -f docker-compose.prod.yml exec backend npx prisma migrate deploy

prisma-studio:
	docker compose -p new-control-finance-prod -f docker-compose.prod.yml exec backend npx prisma studio --hostname 0.0.0.0 --port 5555