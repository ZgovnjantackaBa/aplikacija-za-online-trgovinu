import { Module, NestModule, MiddlewareConsumer, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'src/entities/Administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleFeature } from 'src/entities/article-feature.entity';
import { ArticlePrice } from 'src/entities/article-price.entity';
import { Article } from 'src/entities/article.entity';
import { CartArticle } from 'src/entities/cart-article.entity';
import { Cart } from 'src/entities/cart.entity';
import { Category } from 'src/entities/category.entity';
import { Feature } from 'src/entities/feature.entity';
import { Order } from 'src/entities/order.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ArticleService } from './services/article/article.service';
import { ArticleController } from './controllers/api/article.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';

DatabaseConfiguration

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: DatabaseConfiguration.port,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Administrator, ArticleFeature, ArticlePrice, Article, CartArticle, Cart, Category, Feature, Order, Photo, User]
    }),
    TypeOrmModule.forFeature([Administrator, ArticleFeature, ArticlePrice, Article, CartArticle, Cart, Category, Feature, Order, Photo, User])
  ],
  controllers: [AdministratorController, CategoryController, ArticleController, AuthController],
  providers: [AdministratorService, CategoryService, ArticleService, PhotoService],
  exports: [AdministratorService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
   
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*', 'assets/*', 'uploads/*');
  }
}
