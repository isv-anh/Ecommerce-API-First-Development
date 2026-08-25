

from app.tools.get_product_price import get_product_price


from app.config import settings
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model=settings.DEFAULT_MODEL,
    temperature=settings.TEMPERATURE,
    api_key=settings.DASHSCOPE_API_KEY,
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

tools = [get_product_price]

llm_with_tools = llm.bind_tools(tools)