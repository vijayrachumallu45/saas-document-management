/**
 * DocFlow Core Modules Bundle Index.
 * Automatically registers and references all generated modules.
 */
const TrieSearchIndex = require('./TrieSearchIndex');
const MarkdownParser = require('./MarkdownParser');
const DiffEngine = require('./DiffEngine');
const ConflictResolver = require('./ConflictResolver');
const SettingsManager = require('./SettingsManager');
const DocumentBackup = require('./DocumentBackup');
const SvgCharts = require('./SvgCharts');
const ImageFilters = require('./ImageFilters');
const AccessControl = require('./AccessControl');
const TaskQueue = require('./TaskQueue');
const EncryptionService = require('./EncryptionService');
const DataValidation = require('./DataValidation');
const NotificationManager = require('./NotificationManager');
const WorkflowEngine = require('./WorkflowEngine');
const ActivityTracker = require('./ActivityTracker');
const SyncService = require('./SyncService');
const DatabaseAdapter = require('./DatabaseAdapter');
const QueryBuilder = require('./QueryBuilder');
const CsvParser = require('./CsvParser');
const JsonSchema = require('./JsonSchema');
const PdfExtractor = require('./PdfExtractor');
const DocxRenderer = require('./DocxRenderer');
const XlsxCalculator = require('./XlsxCalculator');
const RouteHandler = require('./RouteHandler');
const TemplateEngine = require('./TemplateEngine');
const CacheManager = require('./CacheManager');
const EventBus = require('./EventBus');
const LoggerService = require('./LoggerService');
const PerformanceMonitor = require('./PerformanceMonitor');
const TranslationService = require('./TranslationService');
const ThemeManager = require('./ThemeManager');
const FormValidator = require('./FormValidator');
const DateFormatter = require('./DateFormatter');
const NumberFormatter = require('./NumberFormatter');
const CurrencyConverter = require('./CurrencyConverter');
const FileCompressor = require('./FileCompressor');
const ZipArchiver = require('./ZipArchiver');
const Base64Coder = require('./Base64Coder');
const Sha256Hasher = require('./Sha256Hasher');
const AesCipher = require('./AesCipher');
const RsaKeyPair = require('./RsaKeyPair');
const JwtDecoder = require('./JwtDecoder');
const SessionStore = require('./SessionStore');
const CookieManager = require('./CookieManager');
const HttpHandler = require('./HttpHandler');
const WebSocketClient = require('./WebSocketClient');
const ThrottleDebounce = require('./ThrottleDebounce');
const DeepClone = require('./DeepClone');
const ObjectMerger = require('./ObjectMerger');
const ArraySorter = require('./ArraySorter');
const ListPaginator = require('./ListPaginator');
const SearchRanker = require('./SearchRanker');
const TextSummarizer = require('./TextSummarizer');
const WordCounter = require('./WordCounter');
const SpellChecker = require('./SpellChecker');
const HtmlSanitizer = require('./HtmlSanitizer');
const UrlParser = require('./UrlParser');
const QueryString = require('./QueryString');
const BrowserStorage = require('./BrowserStorage');
const MemoryCache = require('./MemoryCache');
const IdleDetector = require('./IdleDetector');
const KeyboardShortcuts = require('./KeyboardShortcuts');
const ClipboardService = require('./ClipboardService');
const DragAndDrop = require('./DragAndDrop');
const ResizeObserver = require('./ResizeObserver');
const IntersectionObserver = require('./IntersectionObserver');
const LazyLoader = require('./LazyLoader');
const ImageOptimizer = require('./ImageOptimizer');
const AudioController = require('./AudioController');
const VideoPlayer = require('./VideoPlayer');
const GeolocationTracker = require('./GeolocationTracker');
const DeviceDetector = require('./DeviceDetector');
const NetworkStatus = require('./NetworkStatus');
const BatteryStatus = require('./BatteryStatus');
const PermissionsRequester = require('./PermissionsRequester');
const ShareAPI = require('./ShareAPI');
const SpeechSynthesizer = require('./SpeechSynthesizer');
const SpeechRecognizer = require('./SpeechRecognizer');
const GamepadController = require('./GamepadController');
const HistoryStack = require('./HistoryStack');
const UndoRedo = require('./UndoRedo');
const StateManager = require('./StateManager');
const ReduxStore = require('./ReduxStore');
const ComponentRenderer = require('./ComponentRenderer');
const VirtualDom = require('./VirtualDom');
const WebComponent = require('./WebComponent');
const AppInitializer = require('./AppInitializer');

const modules = {
  TrieSearchIndex,
  MarkdownParser,
  DiffEngine,
  ConflictResolver,
  SettingsManager,
  DocumentBackup,
  SvgCharts,
  ImageFilters,
  AccessControl,
  TaskQueue,
  EncryptionService,
  DataValidation,
  NotificationManager,
  WorkflowEngine,
  ActivityTracker,
  SyncService,
  DatabaseAdapter,
  QueryBuilder,
  CsvParser,
  JsonSchema,
  PdfExtractor,
  DocxRenderer,
  XlsxCalculator,
  RouteHandler,
  TemplateEngine,
  CacheManager,
  EventBus,
  LoggerService,
  PerformanceMonitor,
  TranslationService,
  ThemeManager,
  FormValidator,
  DateFormatter,
  NumberFormatter,
  CurrencyConverter,
  FileCompressor,
  ZipArchiver,
  Base64Coder,
  Sha256Hasher,
  AesCipher,
  RsaKeyPair,
  JwtDecoder,
  SessionStore,
  CookieManager,
  HttpHandler,
  WebSocketClient,
  ThrottleDebounce,
  DeepClone,
  ObjectMerger,
  ArraySorter,
  ListPaginator,
  SearchRanker,
  TextSummarizer,
  WordCounter,
  SpellChecker,
  HtmlSanitizer,
  UrlParser,
  QueryString,
  BrowserStorage,
  MemoryCache,
  IdleDetector,
  KeyboardShortcuts,
  ClipboardService,
  DragAndDrop,
  ResizeObserver,
  IntersectionObserver,
  LazyLoader,
  ImageOptimizer,
  AudioController,
  VideoPlayer,
  GeolocationTracker,
  DeviceDetector,
  NetworkStatus,
  BatteryStatus,
  PermissionsRequester,
  ShareAPI,
  SpeechSynthesizer,
  SpeechRecognizer,
  GamepadController,
  HistoryStack,
  UndoRedo,
  StateManager,
  ReduxStore,
  ComponentRenderer,
  VirtualDom,
  WebComponent,
  AppInitializer,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = modules;
}
if (typeof window !== 'undefined') {
  window.DocFlowModules = modules;
}
