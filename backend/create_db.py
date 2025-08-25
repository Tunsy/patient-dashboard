from models import Base, engine

print("Creating database and tables...")
Base.metadata.create_all(bind=engine)
print("Database and tables successfully created.")