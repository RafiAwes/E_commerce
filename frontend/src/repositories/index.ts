import { MockCatalogRepository } from "./catalog/mock-catalog.repository";
import { MockCollectionRepository } from "./collection/mock-collection.repository";
import { MockOrderRepository } from "./order/mock-order.repository";
import { MockProductRepository } from "./product/mock-product.repository";
import type { CatalogRepository } from "./catalog/catalog.repository";
import type { CollectionRepository } from "./collection/collection.repository";
import type { OrderRepository } from "./order/order.repository";
import type { ProductRepository } from "./product/product.repository";

/**
 * Composition root for data access.
 *
 * This is the only file that names a concrete repository. Point these at
 * `ApiProductRepository`, `ApiCatalogRepository` and friends when the Django
 * or FastAPI backend lands and nothing above the service layer changes.
 */
export const productRepository: ProductRepository = new MockProductRepository();
export const catalogRepository: CatalogRepository = new MockCatalogRepository();
export const collectionRepository: CollectionRepository = new MockCollectionRepository();
export const orderRepository: OrderRepository = new MockOrderRepository();

export type { CatalogRepository, CollectionRepository, OrderRepository, ProductRepository };
export type { OrderDraft } from "./order/order.repository";
