import json
import asyncio
from typing import Optional, Dict, Any, Callable
import websockets
from websockets.exceptions import ConnectionClosed, WebSocketException


class WebSocketClient:
    def __init__(self, uri: str):
        self.uri = uri
        self.websocket: Optional[websockets.WebSocketServerProtocol] = None
        self.is_connected = False
        self.message_handlers: Dict[str, Callable] = {}
        
    async def connect(self) -> bool:
        """连接到WebSocket服务器"""
        try:
            self.websocket = await websockets.connect(self.uri)
            self.is_connected = True
            return True
        except Exception as e:
            print(f"WebSocket连接失败: {e}")
            self.is_connected = False
            return False
    
    async def disconnect(self):
        """断开WebSocket连接"""
        if self.websocket:
            await self.websocket.close()
            self.is_connected = False
    
    async def send_message(self, message: Dict[str, Any]) -> bool:
        """发送消息到服务器"""
        if not self.is_connected or not self.websocket:
            return False
        
        try:
            await self.websocket.send(json.dumps(message))
            return True
        except (ConnectionClosed, WebSocketException) as e:
            print(f"发送消息失败: {e}")
            self.is_connected = False
            return False
    
    async def receive_message(self) -> Optional[Dict[str, Any]]:
        """接收服务器消息"""
        if not self.is_connected or not self.websocket:
            return None
        
        try:
            message = await self.websocket.recv()
            return json.loads(message)
        except (ConnectionClosed, WebSocketException) as e:
            print(f"接收消息失败: {e}")
            self.is_connected = False
            return None
        except json.JSONDecodeError as e:
            print(f"消息解析失败: {e}")
            return None
    
    def register_handler(self, message_type: str, handler: Callable):
        """注册消息处理器"""
        self.message_handlers[message_type] = handler
    
    async def listen(self):
        """监听服务器消息"""
        while self.is_connected:
            message = await self.receive_message()
            if message and 'type' in message:
                handler = self.message_handlers.get(message['type'])
                if handler:
                    await handler(message)
    
    def get_connection_status(self) -> Dict[str, Any]:
        """获取连接状态"""
        return {
            "connected": self.is_connected,
            "uri": self.uri,
            "websocket": self.websocket is not None
        } 