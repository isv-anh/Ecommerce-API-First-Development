

from app.tools.handle_order import handle_order

from app.config import settings
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model=settings.DEFAULT_MODEL,
    temperature=settings.TEMPERATURE,
    api_key=settings.DASHSCOPE_API_KEY_AGENT_1,
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

tools = [handle_order]

order_agent = llm.bind_tools(tools)