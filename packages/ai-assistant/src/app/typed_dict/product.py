from typing import List, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class ProductDict(TypedDict):
    productId: str
    productName: str
    description: str
    price: float
    categoryName: str
    thumbnailUrl: str
    brandName: str
    slug: str

class SearchProductFilter(TypedDict, total=False):
    keyword: Optional[str]
    categoryName: Optional[str]
    brandName: Optional[str]
    minPrice: Optional[float]
    maxPrice: Optional[float]
    page: Optional[int]
    pageSize: Optional[int]
    sort: Optional[str]

class ProductResponseDict(TypedDict):
    products: List[ProductDict]